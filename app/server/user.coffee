# hash = require('./lib/hash')
hash = require('node_hash')

hashPwd = (pwd) ->
	# salt it?
	# h = hash.sha pwd, salt
	hash.sha1 pwd
	
genUserId = (cb) ->
	R.incr ['snubrd:useridcounter'], (err, uid) ->
		cb uid
		
hashauth = (params, cb) ->
	h = hashPwd(params.password)
	R.get ['snubrd:pwd:' + params.username], (err, storedHash) ->
		if h == storedHash
			R.get ['snubrd:userid:byusername' + params.username], (err, uid) ->
				params.success = true
				params.user_id = uid
				cb params
		else
			params.success = false
			cb params

register = (params, cb) ->
	R.exists ['snubrd:userid:byusername:' + params.username], (err, already) ->
		if already
			cb {success: false, reason: 'username already taken.'}
		else
			h = hashPwd params.password
			R.set 'snubrd:pwd:' + params.username, h, (err, resu) ->
				genUserId (uid) ->
					R.set 'snubrd:userid:byusername:' + params.username, uid, (err, resu) ->
						params.success = true
						params.user_id = uid
						# to do: handle redis is down
						cb params
						
		
exports.actions = 
	authenticate: (params, cb) ->
		pwcb = (c) ->
			delete c.password
			cb(c)
		
		if params.register
			register params, pwcb
		else
			hashauth params, pwcb
	logout: ->
		@session.user.logout(cb)                                        # disconnects pub/sub and returns a new Session object
