(ns snuback.test.core  
  (:require 
    [clj-redis.client :as redis])

  (:use [snuback.core]
	  	  [midje.sweet]))

(fact "about time passing slowly"
  ($now) => (roughly ($now) 1000))

;(fact "that is wrong"
;  (+ 1 2) => 5)

(facts "about names and redis"
  (sb-name "foo") => "snubrd:foo"
  (sb-name2id (sb-name "foo")) => "foo"

  (cell-name (parse-coords "[1,2,3]")) => "snubrd:cell:1:2:3"
  (cell-id ["x" "y" "z"]) => "cell:x:y:z"

  (remove-brackets (str "[foo]")) => "foo")

(fact "about global params"
  (doseq [[param-name parser] (seq param-schema)]
    (redis-get-param param-name))
    =not=> (contains nil))

(let [id  "snute:foo"]
  (against-background 

    [(before :contents 
        (let [item  {"onset" "0"    "karma" "50.0"
                     "xpos" "3.2"   "ypos" "3.3"
                     "headcell" "[1,1,4]"}]
          (redis/hmset db (sb-name id) item))

      :after
        (redis/del db [(sb-name id)]))]

    (fact "about getting all items"
      (get-all-items) => (contains [(sb-name id)]))

    (facts "about getting item properties"
      (item-get-prop id "onset") => 0
      (item-get-prop id "karma") => 50.0
      (item-get-prop id "xpos") => 3.2
      (item-get-prop id "ypos") => 3.3
      (item-get-prop id "headcell") => '(1 1 4))

    (fact "about setting item properties"
      (item-get-prop id "xpos") => 3.7
        (against-background (before :facts
          (item-set-prop id "xpos" 3.7))))

    (facts "about adding and removing items to cells"
      (let [coords         [-1000 -1000 -1000]
            pos-non-zero   #(> % 0)]
        (cell-add-item coords id -1000.5) =>  pos-non-zero
        (redis/zrank db (cell-name coords) id) =not=> nil
        (cell-remove-item coords id) => pos-non-zero
        (redis/zrank db (cell-name coords) id) => nil)

        (add-item2range id 5 0) => nil
         
        ; fixme check whether it's there  
        ;(map
        ;  #())
        ;)

        (remove-item-from-range id 5 0) => nil)

        ;fixme check whether it's gone

    (facts "about calculating height and zoomlevel"
      ; [now grandfPos speed grandfTime newKarma]
      (calcHeight 100 30 0.4 0 20) => (roughly 3.32)
      (getZL id 100 0.4) => (roughly 3.32))

    (facts "about cells and position"
      (extremify 4.1) => (roughly 5)
      (extremify -4.1) => (roughly -5)

      (get-cell-pos 0 4.1 -4.1) => [5 -5 0]
      (get-cell-pos 1 4.1 -4.1) => [3 -3 1]
      (get-cell-pos 2 4.1 -4.1) => [2 -2 2]

      (get-cell id 0) => [4 4 0]
      (get-head-cell id 100 0.4) => '(1 1 4))

    (facts "about rescaling items"
      (rescale-item (sb-name id) 100) => nil
    )))