(defproject snuback "0.0.1-SNAPSHOT"
  :description "Rescaling backend for snuboard"
  :dependencies [
  	[org.clojure/clojure "1.3.0"]
  	[clj-redis "0.0.12"]
  	[clj-time "0.3.1"]]
  :dev-dependencies
    [[lein-midje "1.0.7"]
     [midje "1.3.0"]])