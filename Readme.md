# snuboard

## Setup

### Requirements

* Node.js
* [socketstream v0.2](https://github.com/socketstream/socketstream/tree/0.2) `npm install -g socketstream` should do it for now, until version 0.3 gets pushed to npm as default
* [Redis](http://redis.io)
* [Clojure](http://clojure.org), probably install it via [Leiningen](https://github.com/technomancy/leiningen), since you'll need it anyway
* [node-inspector](https://github.com/dannycoates/node-inspector) for debugging

### Getting started

The socketstream [github page](https://github.com/socketstream/socketstream/tree/0.2) has lots of information about how to start socketstream and what to do once you've got it going. This is just a very short intro:

Change into the project directory and run:

    socketstream debug start

You should find the page at [0.0.0.0:3000](http://0.0.0.0:3000)