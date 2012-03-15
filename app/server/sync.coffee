uuid = require('node-uuid')

parseBool = (b) ->
	b is 'true'

parseArray = (kind) ->
	(a) ->
		li = JSON.parse a
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
	# todo: validate!!!
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
	zl = Math.ceil content.zl
	
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
			
		
