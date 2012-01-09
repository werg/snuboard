uuid = require('node-uuid')

parseBool = (b) ->
	b == 'true'

protoSnute =
	id: String
	maxScale: Number
	published: parseBool
	text: String
	xpos: Number
	ypos: Number
	zl: Number
	
parseProto = (obj, proto) ->
	for k, v of proto
		if obj[k]?
			obj[k] = v(obj[k])
	return obj

parseHgetall = (key, proto, cb) ->
	R.hgetall key, (err, obj) ->
		cb err, parseProto(obj, proto)
		
snuteGet = (id, cb) ->
	parseHgetall 'snubrd:snute:' + id, protoSnute, cb

getSnutes = (res, acc, cb) ->
	if res.length > 0
		snuteGet res.pop().toString(),(err, snute) ->
			acc.push snute
			getSnutes res, acc, cb
	else
		cb acc

storeSnute = (content, cb) ->
	R.hmset "snubrd:snute:" + content.id, content, (err, res) ->
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
			content.id = uuid.v4()
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
			
		
