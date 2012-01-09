# hash = require('./lib/hash')
hash = require('node_hash')

hashPwd = (pwd) ->
	# salt it?
	# h = hash.sha pwd, salt
	hash.sha1 pwd
	
genUserId = (cb) ->
	R.incr 'snubrd:useridcounter', (err, uid) ->
		cb uid

exports.authenticate = (params, cb) ->
	if params.register
		SS.user.register params, cb
	else
		SS.user.hashaut params, cb
		
exports.hashauth = (params, cb) ->
	h = hashPwd(params.password)
	R.get 'snubrd:pwd:' + params.username, (err, storedHash) ->
		if h == storedHash
			R.get 'snubrd:userid:byusername' + params.username, (err, uid) ->
				params.success = true
				params.user_id = uid
				cb params
		else
			params.success = false
			cb params

exports.register = (params, cb) ->
	R.exists 'snubrd:userid:byusername:' + params.username, (err, already) ->
		if already
			cb {success: false, reason: 'username already taken.'}
		else
			h = hashPwd params.password
			R.set 'snubrd:pwd:' + params.username, h, (err, resu) ->
				genUserID (uid) ->
					R.set 'snubrd:userid:byusername:' + params.username, uid, (err, resu) ->
						params.success = true
						params.user_id = uid
						# to do: handle redis is down
						cb params
						

exports.actions =
	logout: ->
		@session.user.logout(cb)                                        # disconnects pub/sub and returns a new Session object
