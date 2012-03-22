registerPartial = (partialName) ->
	template = Handlebars.compile($('#templates' + '-' + partialName ).html())
	Handlebars.registerHelper partialName, (arg) ->
		new Handlebars.SafeString template(arg)

exports.setupHandlebars = ->
	Handlebars.registerHelper 'calcPixelposX', C.app.vp.calcPixelposX
	Handlebars.registerHelper 'calcPixelposY', C.app.vp.calcPixelposY
	
	# todo: register all the partials for edit, delete, publish. or actually just for edit, publish and delete are bootbox modal dialogs
	
	#registerPartial
	
	C.views.SnuteView.prototype.template = Handlebars.compile($('#templates-snute').html())
	C.views.MySnuteView.prototype.template = Handlebars.compile($('#templates-mySnute').html())
	
	C.modals.SnuteEdit.prototype.template = Handlebars.compile($('#templates-modalEditSnute').html())
	C.modals.LoginRegister.prototype.template = Handlebars.compile($('#templates-modalLoginRegister').html())

class exports.SnuteView extends Backbone.View
	# todo: add a button to prop up
	# 	next think about linking!!!
	initialize: ->
		@model.view = this
		@model.bind 'change', @render
		#@template = Handlebars.compile($('#templates-snute').html())
		@render()
		
	#template: Handlebars.compile($('#templates-snute').html())
	
	rescale: (scale) =>
		$(@el).transform {matrix: [1.0/scale, 0.0,0.0,1.0/scale,0.0,0.0]}
		
	setHeight: =>
		# get that height / maxscale
		# recalculate it with actual current scale
		maxScale = @model.get 'maxScale'
		#console.log maxScale
		scale = C.app.vp.scale
		
		if scale < maxScale
			s = maxScale
		else
			s = scale
		
		@rescale s
	
	updateHeight: =>
		oldzl = @model.zl
		# todo: the below is inefficient!! we only need oldhc if we actually are leaving it
		oldhc = @model.getHeadCell()
		@model.set {'maxScale': @model.getMaxScale()}, {silent: true}
		@setHeight()
		if Math.extremify(@model.zl) < Math.extremify(oldzl)
			if oldhc?
				oldhc.remove @model
		else if Math.extremify(@model.zl) > Math.extremify(oldzl)
			newhc = @model.getHeadCell()
			if newhc? and not newc.get(@model.id)?
				newhc.add @model
		
	render: =>
		if @el?
			$(@el).remove()
		#fixme: remove previously rendered
		@el = $(@template @model.toJSON())
		@$('.snute-text').linkify()
		@$('a').embedly({maxWidth:400,'method':'afterParent'})
		# fixme: is this right?
		@setHeight()
		$('#viewport').append @el
		@delegateEvents @events
		return @el
		
	propUp: =>
		@model.propUp P.propupValue
		
	events:
	# todo: add a preventdefault to mousedown
	# or rather, look for a minimal distance, minimal time mousemove event in zui panhandler
		"click .propup-button": "propUp"
		
class exports.MySnuteView extends SS.client.views.SnuteView
	initialize: ->
		@model.view = this
		@model.bind 'change', @render
		#@model.bind 'published', @render
		#@template = Handlebars.compile($('#templates-snute').html())
		@render()
		
	render: =>
		if @el?
			$(@el).remove()
		#fixme: remove previously rendered
		@el = $(@template @model.toJSON())
			
		@$('.snute-text').linkify()
		@$('a').embedly({maxWidth:200,'method':'afterParent'})
		@setHeight()
		$('#viewport').append @el
		@delegateEvents @events
		return @el
		
	events:
	# todo: add a preventdefault to mousedown
	# or rather, look for a minimal distance, minimal time mousemove event in zui panhandler
		"click .propup-button": "propUp"
		"click .edit-button": "edit"
		"click .delete-button": "del"
		"click .publish-button": "publish"
	
	edit: =>
		sev = new C.modals.SnuteEdit { model: @model }
	
	del: =>
		@el.remove()
		@model.remove()
		
	publish: =>
		@model.publish()
