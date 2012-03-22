uuid = require('node-uuid')

parseBool = (b) ->
	b is 'true'

parseArray = (kind) ->
	(a) ->
		# this is really kinda ugly!
		# redis returns '1,2,3' instead of '[1,2,3]'
		li = JSON.parse '[' + a + ']'
		return li
		# todo: validate kind!!!

protoSnute =
	id: String
	maxScale: Number
	published: parseBool
	text: String
	xpos: Number
	ypos: Number
	karma: Number
	onset: Number
	headcell: parseArray(Number)

validateSnute = (obj) ->
	# for now just check we have the right attributes
	# todo: validate types
	if protoSnute.length isnt obj.length
		console.log "Wrong number of attributes in validating snute"
		console.log obj
		return false
	else
		result = true
		for k, v of protoSnute
			result = result and obj[k]?
		unless result
			console.log "Wrong attributes"
			console.log obj
		return result
	
parseProto = (obj, proto) ->
	obj1 = {}
	for k, v of proto
		if obj[k]?
			obj1[k] = v(obj[k])
	if obj1.length isnt obj.length
		console.log "We have excess attributes:"
		console.log obj
		console.log obj1
	return obj1
	# todo: exceptions??
	# todo: required fields?

parseHgetall = (key, proto, cb) ->
	R.hgetall key, (err, obj) ->
		cb err, parseProto(obj, proto)
		
snuteGet = (id, cb) ->
	parseHgetall 'snubrd:' + id, protoSnute, cb

getSnutes = (res, acc, cb) ->
	if res.length > 0
		snuteGet res.pop().toString(),(err, snute) ->
			acc.push snute
			getSnutes res, acc, cb
	else
		cb acc

storeSnute = (content, cb) ->
	if validateSnute content
		R.hmset "snubrd:" + content.id, content, (err, res) ->
			# todo: check whether we have an error or a result
			cb content

cellsAddSnute = (cells, score, id, cb) ->
	cell = cells.pop()
	if cell
		R.zadd 'snubrd:' + cell, score, id, ->
			cellsAddSnute cells, score, id, cb
	else
		cb true

publishSnute = (content, cb) =>
	
	h = SS.shared.util.calcHeight(1, P.globalSpeed, content.onset, content.karma)
	zl = Math.ceil h
	
	cells = SS.shared.util.allContainingCells(content)
	
	cellids = ('cell:' + cell.join(':') for cell in cells)
	
	# todo: this is rather inefficient because all obviously included
	# child cells get notified as well
	# a hierarchy of channels would be great here
	SS.publish.channel cellids, 'newSnute', content
	#for cell in cellids
	#	SS.publish.broadcast cell, content 
	cellsAddSnute cellids, zl, content.id, cb

exports.actions = 
	cell:
		read: (coords, cb) ->
			R.zrange 'snubrd:cell:' + coords.join(':'), 0, -1, (err, res) ->
				getSnutes res, [], cb
	
	snute:
		create:  (content, cb) ->
			# todo: 
			#	* karma and
			#		* authorization
			#		* height
			content.id = "snute:" + uuid.v4()
			storeSnute content, cb
			
		update: storeSnute
		
		publish: (id, cb) ->
			snuteGet id,  (err, obj) ->
				if obj.published? and obj.published
					# to do: check above condition
					cb false
				else
					publishSnute obj, ->
						cb true
			
		
