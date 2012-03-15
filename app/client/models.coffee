Backbone.sync = (method, model, options) -> 
	complete = (response) -> 
		model.id = response.id or null
		#unless response.id?
		#	console.log 'undefined id'
		
		options.success response
		
	url = if _.isFunction(model.url) then model.url() else model.url
	# service = url.split("/")[0].toLowerCase() # below use service then instead of url
	if SS.server.sync[url][method]?
		m = if model.toJSON? then model.toJSON() else model
		SS.server.sync[url][method] m, complete
	else
		console.log("Method " + model.url + "." + method + " is not supported!")

exports.getCellsFromRange = (cellX1, cellY1, cellX2, cellY2, zl, options) ->
	result = []
	# 0 is not a valid cell index
	for cellY in _.without [cellY1 .. cellY2], 0
		for cellX in _.without [cellX1 .. cellX2], 0
			cell = C.models.getCell cellX, cellY, zl, options
			if cell?
				result.push cell
	return result
	
exports.getCell = (cellX, cellY, zl, options) ->
	if C.app.cells[[cellX, cellY, zl]]?
		cell = C.app.cells[[cellX, cellY, zl]]
		return cell
	else if options.createCell
		cell = C.app.cells[[cellX, cellY, zl]] = new C.models.Cell [], {x:cellX, y:cellY, z:zl}
		success = options.success
		options.success = (c, resp, xhr)=>
			c.rescale(C.app.vp.scale)
			if success
				success(c, resp, xhr)
		cell.fetch options
		return cell


class exports.Snute extends Backbone.Model
	initialize: ->
		# how about caching this value?
		@set {'maxScale': @getMaxScale()}, {silent: true}
		@view = new C.views.SnuteView {model: this}
		C.app.snutes[@id] = this
	
	# we abuse the url attribute here to store something decidedly non-url, the type-name
	url: 'snute'
	
	#getMaxScale: =>
	#	zl  = @get 'zl'
	#	1 / Math.pow(2, zl)
		
	getMaxScale: =>
		@zl = SS.shared.util.calcHeight(0, P.globalSpeed, @get('onset'), @get('karma'))
		return 1 / Math.pow(2, @zl)
		15
	getHeadCell: =>
		z = Math.ceil(@zl)
		pz =  Math.pow(2,z)
		x = Math.extremify(@get('xpos') / pz)
		y = Math.extremify(@get('ypos') / pz)
		return C.app.cells[[x,y,z]]
		
	propUp: (prop) =>
		@set {'karma': @attributes.karma + prop}, {silent: true}
		@view.updateHeight()

	forAllContainingCells: (iterator) =>
		cells = SS.shared.util.allContainingCells @toJSON()
		for cell in cells
			if C.app.cells[cell]?
				iterator C.app.cells[cell]

	remove: =>
		@forAllContainingCells (cell) =>
			cell.remove this
		delete C.app.snutes[@id]
		delete C.app.mySnutes[@id]	


class exports.MySnute extends SS.client.models.Snute
	initialize: ->
		@set {onset: $now(), karma: 1}, {silent: true}
		# todo: check whether we still need published as an attribute
		@set(
			maxScale: @getMaxScale()
			published: false
		, {silent: true})
		
		@save {},
			success: (response) =>
				C.app.snutes[@id] = this
				C.app.mySnutes[@id] = this
				cells = SS.shared.util.allContainingCells @toJSON()
				@forAllContainingCells (cell) =>
						cell.addUp @toJSON()

				@view = new C.views.MySnuteView {model: this}
		
	publish: =>
		@set {published: true}, {silent:true}
		@remove()
		SS.server.sync.snute.publish @id
		@trigger 'published'
		# todo, attach a callback that triggers an event, which switches the view
	


#randomSnute = (xcell, ycell) ->
#	x = xcell - Math.sgn(xcell) * Math.random()
#	y = ycell - Math.sgn(ycell) * Math.random()
#	m = Math.random() * 100
#	id = Math.random().toString()
#	new C.models.Snute {xpos:x, ypos:y, zl:m, text:[id, xcell, ycell, x, y, m].toString(), 'id': id}

class exports.Cell extends Backbone.Collection
	model: C.models.Snute
	
	initialize: (models, options) ->
		@id = options.id
		@options = options
		@index = 0
		console.log "Cell initialized"
		sig = @getSig()
		console.log sig
		for id, snute of C.app.mySnutes
			# contortions below necessary because [1,2,3] != [1,2,3]
			containingCells = SS.shared.util.allContainingCells(snute.toJSON())
			contains = __.any containingCells, (cellsig) -> __.isEqual(cellsig, sig)
			if contains
				@addUp snute
	
	getChildren: =>
		if @options.z > 0
			x1 = @options.x
			y1 = @options.y
			x2 = @options.x - Math.sgn(@options.x)
			y2 = @options.y - Math.sgn(@options.y)
			C.models.getCellsFromRange x1, y1, x2, y2, @options.z - 1, {createCell: false}
		else 
			[]
	
	getSig: =>
		[@options.x, @options.y, @options.z]
		
	comparator: (snute) =>
		snute.get 'maxScale'
	
	addUp: (snute, options) =>
		already = @get snute.id
		if snute.id? and already
			if snute.toJSON?
				already.set snute.toJSON()
			else
				already.set snute
		else
			@add snute, options
	
	_prepareModel: (model, options) =>
		if model.id?
			if C.app.snutes[model.id]?
				model = C.app.snutes[model.id]
			else unless model instanceof Backbone.Model
				attrs = model
				model = new @model attrs, {collection: this}
				if model.validate and not model._performValidation(attrs, options)
					model = false
		else
			console.log "adding model (cell) with undefined id"
		
		unless model.collection? and model.collection.options.z < @options.z 
			model.collection = this
		return model
	
	# this is no good mvc separation, but here goes
	rescale: (scale) =>
		
		if @index > 0 and @length == 0
			console.log 'strange'
			@index = 0
		
		while @index < @length and @at(@index).get('maxScale') < scale
			@index++
		while @index > 0 and @at(@index - 1).get('maxScale') > scale
			@index--
			
		for i in [0 ... @index]
			@at(i).view.rescale(scale)
			
		for c in @getChildren()
			c.rescale(scale)
			
	sync: (method, model, options) =>
		reqmodel = 
			toJSON: =>
				[@options.x, @options.y, @options.z]
			url: "cell"
			
		Backbone.sync method, reqmodel, options

#	sync: (method, model, options) =>
#		# to do: insert backbone.sync
#		# check what happens when a model is added several times
#		if method is 'read'
#			Backbone.sync method, model, options
#			if @options.z > 0
#				myScale = 1/Math.pow @options.z
#				for c in @getChildren()
#					i = 0
#					while i < c.length and c.at(i).get('maxScale') < myScale
#						@add c.at i
#						i++
#			else
#				@add (randomSnute(@options.x, @options.y) for i in [0 .. 4])
#		else
#			alert("We currently only do read sync on collections")
