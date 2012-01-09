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
		

ZOOMBACKOFF = 4

exports.allContainingCells = (content) ->
	zl = Math.ceil content.zl + ZOOMBACKOFF
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

exports.calcHeight = (grandfPos, speed, grandfTime, newKarma) ->
	return grandfPos - speed * ($now() - grandfTime) + newKarma

exports.globalSpeed = 0.1
