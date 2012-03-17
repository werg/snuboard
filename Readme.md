# snuboard

## Setup

### Requirements

* [Node.js](http://nodejs.org)
* [socketstream v0.2](https://github.com/socketstream/socketstream/tree/0.2) `npm install -g socketstream` should do it for now, until version 0.3 gets pushed to npm as default
* [node-inspector](https://github.com/dannycoates/node-inspector) 
* [node_hash](https://github.com/Marak/node_hash) can be installed locally too `npm install node_hash`
* [node-uuid](https://github.com/broofa/node-uuid) `npm install node-uuid`
* Make sure [Redis](http://redis.io) version 2.4 or higher is installed, not quite sure but some node packages might already install it for you. Start the client `redis-cli` and at the prompt enter `info` to see whether you have it running and what version.
* [Clojure](http://clojure.org), probably install it via [Leiningen](https://github.com/technomancy/leiningen), since you'll need it anyway


### Getting started

#### Node server

The socketstream [github page](https://github.com/socketstream/socketstream/tree/0.2) has lots of information about how to start socketstream and what to do once you've got it going. This is just a very short intro:

Make sure redis is running, change into the project directory and run:

    socketstream debug start

You should find the page at [0.0.0.0:3000](http://0.0.0.0:3000)	

#### Clojure backend

See the [Readme](snuback/Readme.md) file in the backend folder `snuback/`.

## Development

### Important quirks

#### Modifications and reloading

While using SS 0.2.x, if you update/change anything in `lib/` (at least for client side) you will have to manually remove precompiled contents from the `public/assets/` folder in order to have it included upon page-load

    rm public/assets/*

If you change client-side `*.coffee` files you can simply reload the web-browser for changes to take effect. This does not (yet) work for server-side code.

### Debugging

#### Server-side
* Run `socketstream debug start`.
* Start node-inspector. Make sure to start it with `node-inspector &` (the backgrounding '&' is essential, don't ask me why)
* You'll find your code at (http://0.0.0.0:8080/debug?port=5858)