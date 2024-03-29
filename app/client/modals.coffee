class exports.SnuteEdit extends Backbone.View
	initialize: ->
		@render()
		
	render: =>
		@el = $(@template @model.toJSON())
		$('body').append @el
		@el.modal {backdrop: true, keyboard: true, show: true}
		@delegateEvents @events
		@$('.snute-content').focus().select()
		
	events:
		"click .ok-button": "save"
		"click .cancel-button": "hide"
		"click .publish-button": "publish"
	
	save: =>
		@model.set {text: @$('.snute-content').val() }
		@model.save()
		@hide()
	
	publish: =>
		@save()
		@model.publish()

	hide: =>
		@el.modal 'hide'
		@el.remove()
		

class exports.LoginRegister extends Backbone.View
	initialize: ->
		@render()
		
	render: =>
		@el = $(@template())
		$('body').append @el
		@el.modal {backdrop: true, keyboard: true, show: true}
		@delegateEvents @events

	events:
		"click .login-button":    "login"
		"click .cancel-button":   "hide"
		"click .register-button": "register"
		"click  #register-pill":  "switchRegister"
		"click  #login-pill":  "switchLogin"
	
	switchPills: =>
		@$('#register-pill').toggleClass 'active'
		@$('#login-pill').toggleClass 'active'
		@$('#auth-ok-button').toggleClass 'register-button'
		@$('#auth-ok-button').toggleClass 'login-button'
		
	
	switchRegister: =>
		@switchPills()
		@$('.register-fields').show 'fast'
		@$('#auth-ok-button').text('Register')
		#@$('#auth-ok-button').addClass 'register-button'
		#@$('#auth-ok-button').removeClass 'login-button'
		
	
	switchLogin: =>
		@switchPills()
		@$('.register-fields').hide 'fast'
		@$('#auth-ok-button').text('Login')
		#@$('#auth-ok-button').removeClass 'register-button'
		#@$('#auth-ok-button').addClass 'login-button'
		
	
	login: =>
		credentials =
			username: @$('#username').val()
			password: @$('#login-pwd').val()
			register: false
			valid: true
		@hide()
		@options.callback credentials
		
		# todo find out how to authenticate and insert @options.callback :)
	
	register: =>
		credentials =
			username: @$('#username').val()
			password: @$('#login-pwd').val()
			email:    @$('#register-email').val()
			register: true
			valid: true
		@hide()
		@options.callback credentials
	
	hide: =>
		@el.modal 'hide'
		@el.remove()
		
	cancel: =>
		@hide()
		@options.callback {valid: false}
		
	
