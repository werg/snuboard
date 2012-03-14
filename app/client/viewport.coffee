class exports.Viewport extends Backbone.View
	initialize: ->
		
		@zui = new ZUI53.Viewport document.getElementById('zui')
		
		@el = $ '#viewport'
		@scale = 1
		@panX = 0
		@panY = 0
		@zl = @calcZL @scale
		@currentCells = []
		@currentSigs = []
		@lastMoved = 0
		
		@surf = new ZUI53.Surfaces.SNU @el, @moved
		
		@zui.addSurface @surf
		
		pan_tool = new ZUI53.Tools.Pan(@zui)
		@zui.toolset.add( pan_tool )
		pan_tool.attach()
	
	moved: (panX, panY, scale) =>
		@lastMoved = $now()
		@rescaleCurrent panX, panY, scale
		
	
	rescaleCurrent: (panX, panY, scale) =>
		oldCurrentSigs = @currentSigs
		# fixme this loads cells, but subscribes to updates after loading
		# so if somethin gets posted between loading and subscribing we're screwed
		@currentCells = @getCurrentCellsFromPos(panX, panY, scale)
		@currentSigs = _.invoke @currentCells, 'getSig'
		unless _.isEqual @currentSigs, oldCurrentSigs
			SS.server.app.switchCurrentCells oldCurrentSigs, @currentSigs
			
		for cell in @currentCells
			cell.rescale(scale)
		
	getCenterPos: =>
		vpd = @getVPDims()
		rescale  = 1/@scale
		[rescale * (vpd.width/2 - @panX) / P.cellsizex, rescale * (vpd.height/2 - @panY) / P.cellsizey, @zl]
	
	setCenterPos: (xpos, ypos, zl) =>
		unless zl?
			zl = @zl
		vpd = @getVPDims()
		
		scale = @calcScale zl
		panX = vpd.width/2 - scale * xpos * P.cellsizex
		panY = vpd.height/2 - scale * ypos * P.cellsizey
		
		@zui.panScaleTo panX, panY, scale
	
	getCurrentCellsFromPos: (panX, panY, scale) =>
		@panX = panX
		@panY = panY
		@scale = scale
		
		#pan first, then scale
		result = []
		
		@zl = @calcZL scale
		#idealscale = @calcScale zl
		#rescale = idealscale/scale
		
		rescale = 1/scale
		
		# todo check this whole rescale business!!!!!!!
		
		vpd = @getVPDims()
		cellX1 = Math.extremify(rescale * -panX / P.cellsizex)
		cellY1 = Math.extremify(rescale * -panY / P.cellsizey)
		cellX2 =  Math.extremify(rescale * (vpd.width - panX) / P.cellsizex)
		cellY2 =  Math.extremify(rescale * (vpd.height - panY) / P.cellsizey)
		
		C.models.getCellsFromRange cellX1, cellY1, cellX2, cellY2, Math.round(@zl), {createCell: true}
		
	getVPDims: =>
		{width: $(window).width(), height: $(window).height()}
		
	calcPixelposX: (xpos) =>
		P.cellsizex * xpos
		
	calcPixelposY: (ypos) =>
		P.cellsizey * ypos
		
	calcScale: (zl) =>
		1 / Math.pow(2, zl)
		
	calcZL: (scale) =>
		- Math.log2(scale)
		
	center: =>
		@setCenterPos 0, 0, @zl
