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
		if scale < maxScale
			s = scale/ maxScale # ?
		else
			s = scale
		
		$(@el).transform {matrix: [1.0/s, 0.0,0.0,1.0/scale,0.0,0.0]}

	render: =>
		if @el?
			$(@el).remove()
		#fixme: remove previously rendered
		@el = $(@template @model.toJSON())
		@$('.snute-text').linkify()
		# fixme: is this right?
		@rescale C.app.vp.scale
		$('#viewport').append @el
		return @el
		
		
class exports.MySnuteView extends Backbone.View
	initialize: ->
		@model.view = this
		@model.bind 'change', @render
		@model.bind 'published', @render
		#@template = Handlebars.compile($('#templates-snute').html())
		@render()
		
	rescale: (scale) =>
		$(@el).transform {matrix: [1.0/scale, 0.0,0.0,1.0/scale,0.0,0.0]}
		
	render: =>
		if @el?
			$(@el).remove()
		#fixme: remove previously rendered
		@el = $(@template @model.toJSON())
		if @model.get('published') or @model.get('published') == 'true'
			@el.css {'background-color': "#FFF7BF"}
			
		@$('.snute-text').linkify()
		@rescale C.app.vp.scale
		$('#viewport').append @el
		@delegateEvents @events
		return @el
		
	events:
	# todo: add a preventdefault to mousedown
	# or rather, look for a minimal distance, minimal time mousemove event in zui panhandler
		"click .edit-button": "edit"
		"click .delete-button": "del"
		"click .publish-button": "publish"
	
	edit: =>
		sev = new C.modals.SnuteEdit { model: @model }
	
	del: =>
		# to do
		alert "We still need to implement deleting snutes."
		
	publish: =>
		@model.publish()
	
# mixin of SnuteView
#_.default SS.client.views.MySnuteView.prototype, SS.client.views.SnuteView.prototype
