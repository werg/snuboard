# Parameters for client-side code
# fixme: set these universally from server
CELLSIZEX = 1440
CELLSIZEY = 1080

SNUTESIZEX = 40
SNUTESIZEY = 30

MARGINFACTOR = 0.75

window.C = SS.client


# objects that act as central repository for all 
# snutes and cells currently loaded

# snutes are indexed by their id
exports.snutes = {}
# cells are indexed by their position
# so C.app.cells[[1,2,0]] is the cell at position (1,2,0)
exports.cells = {}


# This method is called automatically when the websocket connection is established.
# Here we setup the router and some ui elements
exports.init = ->
	# fixme: there's a shaddowing variable in util.coffee
	window.$now = Date.now or -> new Date().getTime()
	#window.$time = Date.now or -> new Date().getTime()
	
	C.app.vp = new C.viewport.Viewport(CELLSIZEX, CELLSIZEY)
	C.views.setupHandlebars()
	C.app.route = new C.app.Router()
	
	unless Backbone.history.start {pushState: true}
		C.app.vp.center()
	
	# update the position hash repeatedly
	updatePosHash = ->
		if $now() - C.app.vp.lastMoved > 1000
			C.app.route.saveCurrPos()
		
	setInterval updatePosHash, 2000
	
	# update
	updateHeights = ->
		#console.log 'updating height'
		for key, snute of C.app.snutes
			snute.view.updateHeight()
			
	setInterval updateHeights, 10000
	
	SS.events.on 'newSnute', (msg, channel) ->
		console.log "we recieved a new snute at: " + channel
		[cell, x, y, z] = channel.split(':')
		# to do: check whether we need to add it to its children too! yes we do!
		C.app.cells[[x,y,z].join(',')].addUp msg
	
	$('#new-snute').click ->
		[x, y] = C.app.calcNewVPPosition()
		snute = new C.models.MySnute {xpos: x, ypos: y, zl: C.app.vp.zl, text: "A new snute has arisen!"}
		
		
	$('#login-button').click ->
		C.app.login false
		
	$('#register-button').click ->
		C.app.login true
		
	$('#logout-button').click ->
		SS.server.app.logout()
		if credentials.true
			$('.auth-buttons').show()
			$('.logout-button').hide()
		
finishedAuth = (credentials)->
	if credentials.success
		$('.auth-buttons').hide()
		$('.logout-button').show()
	else
		console.log 'authentication unsuccessful'

exports.login = (isRegister, cb) ->
	unless cb?
		cb = (c) ->
			console.log 'login done'
	modal = new C.modals.LoginRegister
		callback: (credentials) ->
			if credentials.valid
				SS.server.user.authenticate credentials, (c) ->
					finishedAuth(c)
					cb(c)
			else
				
				credentials.success = false
				cb credentials
	if isRegister
		modal.switchRegister()
		
	#{password, username}

exports.calcNewVPPosition =  ->
	vp = C.app.vp
	vpd = vp.getVPDims()
	
	# TODO TODO: check how we load current
	
	marginX = MARGINFACTOR * vpd.width 
	marginY = MARGINFACTOR * vpd.height 
	
	rescale = 1/vp.scale
	x1 = rescale * (-vp.panX  + marginX/2) / vp.cellsizeX
	y1 = rescale * (-vp.panY + marginY/2) / vp.cellsizeY
	
	
	x = x1 +  rescale * (Math.random() * (vpd.width -  marginX) - SNUTESIZEX) / vp.cellsizeX
	y = y1 +  rescale * (Math.random() * (vpd.height - marginY) - SNUTESIZEY) / vp.cellsizeY
	
	return [x, y]

class exports.Router extends Backbone.Router
	
	routes:
		":x/:y/:z":        "movePos"
		"login":           "login"
		"logout":          "logout"
		"register":        "register"
		"edit/snute/:id":  "editSnute"
	
	movePos: (xpos,ypos,zl) ->
		renum = (p) ->
			Number p.replace '_', '.'
		C.app.vp.setCenterPos renum(xpos), renum(ypos), renum(zl)
	
	login: ->
		C.app.login()
	
	logout: ->
		C.app.logout()
	
	editSnute: (id) ->
		C.app.snutes[id].view.edit()
	
	saveCurrPos: =>
		denum = (p) ->
			String(p).replace '.', '_'
		fragment = _.map(C.app.vp.getCenterPos(), denum).join '/'
		for i in [0 ... 3]
			fragment = fragment.replace '.', '_'
		@navigate fragment, false
