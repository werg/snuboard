(ns snuback.core
  (:require 
    [clj-redis.client :as redis]
    [clojure.string :as cljstr]
    [clj-time.core]
    [clj-time.coerce]
    [clojure.contrib.generic.math-functions :as math]))

(def db (redis/init))

; todo: set the globalspeed-parameter


(defn $now
  "Yields the current unix-timestamp."
  []
  (clj-time.coerce/to-long (clj-time.core/now)))



;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Naming and Redis

(defn sb-name 
  "Returns a 'snuboard name' wich is simply an id prefixed by 'snubrd:', as used for redis keys."
  [id]
  (str "snubrd:" id))

(defn sb-name2id
  "Takes a redis key and extracts the id postfix."
  [sb-name]
  (cljstr/replace sb-name "snubrd:" ""))

(defn cell-id 
  "Constructs a cell id, as in 'cell:1:-1:0' from a list of coordinates."
  [coords]
  (cljstr/join ":" (cons "cell" coords)))

(defn cell-name
  "Constructs a cell-sb-name (for redis) from a list of coordinates."
  [coords]
  (sb-name (cell-id coords)))

(defn remove-brackets
  "Removes leading and trailing brackets from a string, such as a json-serialized list."
  [stri]
  (cljstr/replace stri #"(\[|\])" ""))

(defn parse-coords
  "Parse coordinates to a sequence from a json-serialized list."
  [str-coords]
  (map #(Integer/parseInt %) (cljstr/split (remove-brackets str-coords) #",")))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Accessing items values and properties in Redis

(defn get-all-items 
  "Retrieves all the keys of all currently active items. Currently only implements snutes."
  []
  (redis/keys db "snubrd:snute:*"))

(def type-getters "Map of type-keywords to their respective parsing functions."
  {:int #(Integer/parseInt %)
   :double #(Double/parseDouble %)
   :coords parse-coords})

(def type-setters "Map of type-keywords to their respective parsing functions."
  {:int #(. % toString)
   :double #(. % toString)
   :coords #(str "[" (cljstr/join "," %) "]")})

(def snute-schema "Maps item properties to type-keywords for parsing." 
  {"onset" :int
   "karma" :double
   "xpos" :double
   "ypos" :double
   "headcell" :coords })

(def item-schemata "Maps item-kind-markers to their respective schemata." {
  "snute" snute-schema })

(defn item-get-prop
  "Retrieves a property of an item, parsing it to the item's kind schema."
  [id property]
  (let [[kind uid] (cljstr/split id #":")]
    ((type-getters ((item-schemata kind) property)) (redis/hget db (sb-name id) property))))

(defn item-set-prop
  "Sets a property of an item."
  [id property value]
  (let [[kind uid] (cljstr/split id #":")]
    (redis/hset db (sb-name id) 
      property ((type-setters ((item-schemata kind) property)) value))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Zoomlevel and positioning in cells

(def log2base (math/log 2.0))

(defn log2 [x] (/ (math/log x) log2base))

(defn exp2 [x] (math/exp (* x log2base)))

(defn calcHeight
  "Calculates the height/zoomlevel of an item, given all relevant parameters."
  [now grandfPos speed grandfTime newKarma]
  (log2 (- (+ newKarma grandfPos) (* speed (- now grandfTime)))))

(defn getZL
  "Calculates the height/zoomlevel of an item, from the redis representation."
  [id now globalspeed]
  (calcHeight now 0.0 globalspeed (item-get-prop id "onset") (item-get-prop id "karma" )))

(defn extremify
  "Helper function that maps a float to the closest integer with a greater distance to 0."
  [x]
  (if (> x 0)
    (int (math/ceil x))
    (if (< x 0)
      (int (math/floor x))
      (int x))))

(defn get-cell-pos 
  "For an xpos and ypos, determine the corresponding cell coordinates at zoomlevel z."
  [z xpos ypos]
  (let [pz (exp2 z)
        x  (extremify (/ xpos pz))
        y  (extremify (/ ypos pz))]
  [x y z]))

(defn get-cell
  "Determine corresponding cell for an item id and a zoomlevel z."
  [id z]
  (get-cell-pos z (item-get-prop id "xpos") (item-get-prop id "ypos")))

(defn get-head-cell
  "Gets the coordinates of the head cell of item id at timepoint now."
  [id now globalspeed]
  (get-cell id (int (math/ceil (getZL id now globalspeed)))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Manipulating cells

(defn cell-add-item
  "Adds an item to a cell."
  [cell-pos item-id zl]
  (redis/zadd db (cell-name cell-pos) zl item-id))

(defn cell-remove-item
  "Removes an item from a cell."
  [cell-pos item-id]
  (redis/zrem db (cell-name cell-pos) item-id))

(def param-schema "The schema according to which parameters from redis are parsed"{
  "globalSpeed" #(Float/parseFloat %)})

(defn redis-get-param
  "Retrieve a parameter of param-name and parse via param-schema."
  [param-name]
  ((param-schema param-name) (redis/get db (sb-name (str "param:" param-name)))))


(defmacro do-cells "Mainly used for adding/removing items from a cellrange" 
  [cell-range operation item-id & args]
  `(doseq [z# ~cell-range]
      (~operation 
        (get-cell-pos
          z# (item-get-prop ~item-id "xpos") (item-get-prop ~item-id "ypos"))
        ~item-id ~@args)))

(defn add-item2range "Add an item to a range of cells"
  ([item-id fromz zl]
    (add-item2range item-id fromz 0 zl))

  ([item-id fromz toz zl]
    (do-cells (range 0 (max 0 fromz))
      cell-add-item item-id zl)))

(defn remove-item-from-range "Remove an item from a range of cells"
  [item-id fromz toz]
    (do-cells (range fromz (max 0 toz))
          cell-remove-item item-id))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Main rescaling

(defn rescale-item [item-sb-id now] "Reset all cells taking into account the item's new height."
  (let [item-id (sb-name2id item-sb-id)
        globalspeed (redis-get-param "globalSpeed")
        curr-hc-coords (get-head-cell item-id now globalspeed)
        old-hc-coords  (item-get-prop item-id "headcell")]
          
    ; write new headcell:
    (item-set-prop
      item-id "headcell" (str "[" (cljstr/join "," curr-hc-coords) "]" ))

    ; update cell representations
    (let [newz (nth curr-hc-coords 2)
          oldz (nth old-hc-coords 2)]

      (if (> oldz newz)
        ; we have fallen back to lower cells
        ; remove our item from all cells in between

        (remove-item-from-range item-id (inc oldz) (inc newz))

        ; check whether we are below 0
        (if (> 0 newz)
          ; remove item from redis
          (redis/del [item-sb-id])))

        ; now update our item from newz till the end
        (add-item2range item-id (inc newz) (getZL item-id now globalspeed)))))

(defn rescale 
  []    
  (let [now ($now)]
    (doseq [item-sb-id (get-all-items)]
      (rescale-item item-sb-id now))
      ))

(defn run-rescale
  "An infinite loop rescaling all items it finds in every timestep."
  []
  (while true
    (rescale)))
              
; we need the scale borders of each cell
; (convention is to include [1, 0] in cell of zl 1)


(defn -main []
  (run-rescale))