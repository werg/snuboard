exports.actions =
	switchCurrentCells: (oldCells, newCells, cb) ->
		for cell in newCells
			@session.channel.subscribe 'cell:' + cell.join(':')
		for cell in oldCells
			@session.channel.unsubscribe 'cell:' + cell.join(':')
		
		cb true
	
	authenticate: (credentials, cb) ->
		@session.authenticate 'userAuth', credentials, (response) =>
		@session.setUserId(response.user_id) if response.success       # sets session.user.id and initiates pub/sub
		cb(response)                                                  # sends additional info back to the client

	logout: (cb) ->
		@session.user.logout(cb)                                        # disconnects pub/sub and returns a new Session object


setParams2Redis = ->
	console.log 'Setting params to Redis'
	for k,v of SS.shared.params.values
		R.set 'snubrd:param:' + k, v

setParams2Redis()