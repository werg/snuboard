(ns snuback.core
  (:require 
    [clj-redis.client :as redis]
    [clojure.string :as cljstr]
    [clj-time.core]
    [clj-time.coerce]
    [clojure.contrib.math :as math]))

(def db (redis/init))

(defn snute-name [id]
  (cljstr/join ":" ["snubrd" "snute" id]))
(defn cell-name [coords]
  (cljstr/join ":" (concat ["snubrd" "cell"] coords)))

(defn $now [] (clj-time.coerce/to-long (clj-time.core/now)))

(defn redis-get
  ([id property] (redis-get id property identity))
  ([id property convert-fun]
    (convert-fun 
      (redis/hget db id property)))

(defn redis-get-schema [id schema property]
  (redis-get id property (schema property)))

(defn remove-brackets [stri]
  (cljstr/replace stri #"(\[|\])" ""))

(defn parse-coords [str-coords]
  (map #(Integer/parseInt %) (cljstr/split (remove-brackets str-coords) #","))
)

(def snute-schema {
  "onset" Integer/parseInt
  "karma" Float/parseFloat
  "xpos" Float/parseFloat
  "ypos" Float/parseFloat
  "headcell" parse-coords
})

(defn item-get [id property]
  (redis-get-schema (snute-name id) snute-schema property))

(defn calcHeight [now grandfPos speed grandfTime newKarma]
  (- (+ newKarma grandfPos) (* speed (- now grandfTime))))

(defn getZL [id now]
  (calcHeight now 0.0 GLOBALSPEED (item-get id "onset") (item-get id "karma" )))

(defn get-all-items []
  (redis/keys db "snubrd:snute:*"))

(defn extremify [x]
  (if (> x 0)
    (int (math/ceil x))
    (if (< x 0)
      (int (math/floor x))
      (int x))))

(defn get-cell-pos [id z xpos ypos])
  (let [pz (math/expt 2 z)
        x  (extremify (/ xpos pz))
        y  (extremify (/ ypos pz))]
  [x y z]))

(defn get-cell [id z]
  (get-cell-pos id z (item-get id "xpos") (item-get id "ypos")))

(defn get-head-cell [id now]
  (get-cell id (int (math/ceil (getZL id now)))))

(defn cell-add-item [cell-pos item-id zl]
  (redis/zadd (cell-name cell-pos) zl item-id))

(defn cell-remove-item [cell-pos item-id]
  (redis/zrem (cell-name cell-pos) item-id))

(defn run-rescale []
  (while true
    (let [now ($now)]
      (doseq [item-id (get-all-items)]
        (let [curr-hc-coords (get-head-cell item-id now)
              old-hc-coords  (item-get id "headcell")
              xpos (item-get id "xpos")
              ypos (item-get id "ypos")]

          ; write new headcell:
          (redis/hset db id (cljstr/join "," curr-hc-coords))

          (if (not= curr-hc-coords old-hc-coords)
            ; in case the item moved
            (let [newz (nth curr-hc-coords 2)
                  oldz (nth old-hc-coords 2)]

              (if (> newz oldz)
                ; we have advanced to a higher zoomlevel
                ; add our item to all cells in between
                (doseq [z (range (inc oldz) (inc newz))]
                  (cell-add-item (get-cell-pos id z xpos ypos) item-id (getZL item-id now))))

              (if (> oldz newz)
                ; we have fallen back to lower cells
                ; remove our item from all cells in between
                (doseq [z (range (inc oldz) (max 0 (inc newz)))]
                  (cell-remove-item (get-cell-pos id z xpos ypos item-id))
                ; check whether we are below 0
                (if (> 0 newz)
                  ; todo: remove item from redis
                  )))

              (doseq [z (range 0 (max 0 (inc newz)))]
                ; now update our item from newz till the end
                (cell-add-item  (get-cell-pos id z xpos ypos) item-id (getZL item-id now))))))))))
              
; we need the scale borders of each cell
; (convention is to include [1, 0] in cell of zl 1)
