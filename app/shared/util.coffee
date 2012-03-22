ln2 = Math.log(2)
Math.log2 = (x) ->
	Math.log(x)/ln2
	
Math.extremify = (x) ->
	if x > 0
		Math.ceil x
	else if x < 0
		Math.floor x
	else
		1
		
Math.sgn = (x) ->
	if x > 0
		1
	else if x < 0
		-1
	else
		0
		

ZOOMBACKOFF = 3

exports.allContainingCells = (content) ->
	zl = SS.shared.util.calcHeight(0, SS.shared.params.values.globalSpeed, content.onset, content.karma) + ZOOMBACKOFF
	xpos = content.xpos
	ypos = content.ypos
	cells = []
	
	scale = 1
	for i in [0 .. zl]
		xcell = Math.extremify xpos/scale
		ycell = Math.extremify ypos/scale
		cells.push [xcell, ycell, i]
		scale = scale/2
		
	return cells

# fixme: there's a global variable of same name in client-side app.coffee
$now = Date.now or -> new Date().getTime()

exports.calcHeight = (grandfPos, speed, grandfTime, newKarma) ->
	now = $now()
	pos = grandfPos - speed * (now - grandfTime) + newKarma
	return Math.sgn(pos) * Math.log2(Math.abs(pos))