(function() {

	function PIEsprite() {
		this.initialize();
	}

	var p = PIEsprite.prototype = new createjs.Sprite();

	p.Sprite_initialize = p.initialize;

	/* variables */
	p.pie;

	/* Root Point */
	p.aRoot = new createjs.Point();    
	p.dRoot = new createjs.Point();

	/* Anchor Points */
	p.aAnchor = new createjs.Point();
	p.dAnchor = new createjs.Point();
	p.PIErevolving;
	p.PIErAngle;

	p.PIEvisible;
	p.PIEtransform;

	p.PIEaLastPoint;
	p.PIEdLastPoint;

	p.PIEaClick;
	p.PIEaGrab;
	p.PIEaDrag;
	p.PIEaDrop;
	p.PIEdefaultDrag;

	p.PIEfill;
	p.PIEfColor;
	p.PIEfOpacity;
	p.PIEborder;
	p.PIEbWidth;
	p.PIEbColor;
	p.PIEbOpacity;


	p.initialize = function() {
		this.Sprite_initialize();	
	}


	/*
	 * get Root()
	 */
	p.getRoot=function()
	{
	    return(this.aRoot);
	}
	/*
	 * set Root(aPoint)
	 * aPoint - Root Point
	 */
	p.setRoot=function(aPoint)
	{
	    this.aRoot = aPoint;
	    if (this.isPIEtransformEnabled()) {
	    	this.dRoot = this.pie.PIEapplicationToDisplay(this.aRoot);
	    } 
	    else {
	    	this.dRoot = this.aRoot;	
	    }

	    /* Change Location */
	    this.x = this.dRoot.x;
	    this.y = this.dRoot.y;
	}
	/*
	 * get RootX()
	 */
	p.getRootX=function()
	{
	    return(this.aRoot.x);
	}
	/*
	 * get RootY()
	 */
	p.getRootY=function()
	{
	    return(this.aRoot.y);
	}

	/*
	 * get Anchor()
	 */
	p.getAnchor=function()
	{
	    return(this.aAnchor);
	}
	/*
	 * set Anchor(aPoint)
	 * aPoint - Anchor Point
	 */
	p.setAnchor=function(aPoint)
	{
	    this.aAnchor = aPoint;
	    if (this.isPIEtransformEnabled()){
	    	this.dAnchor = new createjs.Point();
		this.dAnchor.x = this.transformX + this.aAnchor.x;
		this.dAnchor.y = this.transformY + this.aAnchor.y;
	    }
	    else this.dAnchor = this.aAnchor;
	}
	/*
	 * get AnchorX()
	 */
	p.getAnchorX=function()
	{
	    return(this.aAnchor.x);
	}
	/*
	 * get AnchorY()
	 */
	p.getAnchorY=function()
	{
	    return(this.aAnchor.y);
	}
	/*
	 * get application distance(fromX:Number, fromY:Number)
	 */
	p.getApplicationDistance=function(fromX, fromY)
	{
	    return(Math.sqrt(((fromX - this.aAnchor.x) * (fromX - this.aAnchor.x)) + ((fromY - this.aAnchor.y) * (fromY - this.aAnchor.y))));
	}
	/*
	 * get display distance(fromX:Number, fromY:Number)
	 */
	p.getDisplayDistance=function(fromX, fromY)
	{
	    return(Math.sqrt(((fromX - this.dAnchor.x) * (fromX - this.dAnchor.x)) + ((fromY - this.dAnchor.y) * (fromY - this.dAnchor.y))));
	}

	/*
	 * Rotation Control Methods
	 */
	p.setPIErevolveAnchor=function(cPoint, revolveAngle)
	{

	    this.setPIErevolving(true);
	    this.setAnchor(cPoint);
		this.revolvePIEelement(revolveAngle);
	}
	p.revolvePIEelement=function(revolveAngle)
	{
	var aRadius;
	var aPoint;
	var angle;

	    if (this.isPIErevolving())
	    {
	        /* Now get the current location in Application co-ordinates */
	        //aPoint = pie.PIEdisplayToApplication(new Point(this.x, this.y));
		aPoint = new createjs.Point();
		aPoint.x = this.x + this.transformX;
		aPoint.y = this.y + this.transformY;
	        /* Now revolve the PIEsprite in Application co-ordinates */
	        //aRadius = this.getApplicationDistance(aPoint.x, aPoint.y);
	        this.setRoot(new createjs.Point(this.aAnchor.x + aRadius * Math.cos(revolveAngle), this.aAnchor.y + aRadius * Math.sin(revolveAngle)));
		for(var tIndex=0; tIndex<this.dVertices.length; tIndex++) {
			aRadius = Math.sqrt(this.aVertices[tIndex].x*this.aVertices[tIndex].x + this.aVertices[tIndex].y*this.aVertices[tIndex].y);
			angle = revolveAngle + Math.atan(this.aVertices[tIndex].y/this.aVertices[tIndex].x);
			this.dVertices[tIndex].x = this.transformX+aRadius*Math.cos(angle);
			this.dVertices[tIndex].y = this.transformY+aRadius*Math.sin(angle);	
		}
		
		this.PIEcreateGraphics();
	    }
	}
	p.isPIErevolving=function()
	{
	    return(this.PIErevolving);
	}
	p.setPIErevolving=function(revolveFlag)
	{
	    this.PIErevolving = revolveFlag;
	}

	/*
	 * Rotation Control Methods
	 */
	p.rotatePIEelement=function(rotateAngle)
	{
	    this.shape.rotation=rotateAngle * 180/Math.PI;
	    //this.shape.setTransform(180,80,1,1,rotateAngle * 180 / Math.PI);
	}

	/*
	 * Visiblity Control Methods
	 */
	p.isPIEvisible=function()
	{
	    return(this.PIEvisible);
	}
	p.setPIEvisible=function()
	{
	    this.PIEvisible = true;
	}
	p.setPIEinvisible=function()
	{
	    this.PIEvisible = false;
	}

	/*
	 * Transform Control Methods
	 */
	p.isPIEtransformEnabled=function()
	{
	    return(this.PIEtransform);
	}
	p.enablePIEtransform=function()
	{
            
	    this.PIEtransform = true;
	    this.setRoot(this.aRoot);
	}
	p.disablePIEtransform=function(shape)
	{
	    this.PIEtransform = false;
	    this.setRoot(this.aRoot);
            
	}

	/*
	 * add ClickListener(aClick:Function)
	 * aClick : Function
	 */
	p.addClickListener=function(aClick)
	{
	    this.PIEaClick = aClick;
	    if (this.buttonMode == false)
	    {
	        this.buttonMode = true;
	        /* Now add the Mouse Click Handler */
	        this.addEventListener(MouseEvent.CLICK, this.handleClick);
	    }
	}
	/*
	 * remove ClickListener()
	 */
	p.removeClickListener=function()
	{
	    if (this.PIEaClick != null)
	    {
	        this.buttonMode = false;
	        this.PIEaClick   = null;
	        /* Now remove the Mouse Click Handler */
	        this.removeEventListener(MouseEvent.CLICK, this.handleClick);
	    }
	}
	/*
	 * Handle Click(cEvent:MouseEvent)
	 * cEvent - Click Event
	 */
	p.handleClick=function(cEvent)
	{
	    if (this.PIEaClick != null) { this.PIEaClick(); }
	}

	p.setPIEdefaultDrag=function(defaultFlag)
	{
	    this.PIEdefaultDrag = defaultFlag;
	}

	/**
	 * Add all three grab, drag and drop functions(aGrab:Function, aDrag:Function, aDrop:Function)
	 * aGrab : Called when Mouse Down event on this sprite
	 * aDrop : Called when Mouse Up event occurs after Mouse Down on any point in Stage
	 * The object is moved by default without informing the application
	 */
	p.addDefaultDragAction=function(aGrab, aDrop)
	{
	    this.PIEdefaultDrag = true;
	    addGrabListener(aGrab);
	    this.PIEaDrag = null;
	    addDropListener(aDrop);
	}
	/**
	 * Add all three grab, drag and drop functions(aGrab:Function, aDrag:Function, aDrop:Function)
	 * aGrab : Called when Mouse Down event on this sprite
	 * aDrag : Called when Mouse Move event occurs after Mouse Down on any point in Stage
	 * aDrop : Called when Mouse Up event occurs after Mouse Down on any point in Stage
	 * The application has to move the object
	 */
	p.addDragAndDropListeners=function(aGrab, aDrag, aDrop)
	{
	    this.PIEdefaultDrag = false;
	    addGrabListener(aGrab);
	    addDragListener(aDrag);
	    addDropListener(aDrop);
	}
	/*
	 * add GrabListener(aGrab:Function)
	 * aGrab : Function
	 */
	p.addGrabListener=function(aGrab)
	{
	    this.PIEaGrab = aGrab;
	    if (this.buttonMode == false)
	    {
	        this.buttonMode = true;
	        /* Now add the Mouse Down Handler */
	        this.addEventListener(MouseEvent.MOUSE_DOWN, pie.PIEdisplayGrabMe);
	    }
	}
	/*
	 * remove GrabListener()
	 */
	p.removeGrabListener=function()
	{
	    if (this.PIEaGrab != null)
	    {
	        this.buttonMode = false;
	        this.PIEaGrab   = null;
	        /* Now remove the Mouse Down Handler */
	        this.removeEventListener(MouseEvent.MOUSE_DOWN, pie.PIEdisplayGrabMe);
	    }
	}
	/*
	 * Handle Grab(displayClickX:Number, displayClickY:Number)
	 * displayClickX - X coordinate of click in display space
	 * displayClickY - Y coordinate of click in display space
	 */
	p.handleGrab=function(displayClickX, displayClickY)
	{
	    /* Store Click Points */
	    this.PIEdLastPoint = new Point(displayClickX, displayClickY);
	    if (this.isPIEtransformEnabled()) this.PIEaLastPoint = pie.PIEdisplayToApplication(this.PIEdLastPoint);
	    else this.PIEaLastPoint = this.PIEdLastPoint;
	    /* Now call application Listener */
	    if (this.PIEaGrab != null) this.PIEaGrab(this.PIEaLastPoint.x, this.PIEaLastPoint.y);
	}

	/*
	 * Transform Coordinates and Call application Handler(dMoseX:Number, dMouseY:Number, aFunction:Function)
	 * dMouseX   - X coordinate of click in display space
	 * dMouseY   - Y coordinate of click in display space
	 * aFunction - Application function to be called after transforming points
	 */
	p.transformAndCall=function(dMouseX, dMouseY, aFunction)
	{
	var dSecondLastPoint;
	var aSecondLastPoint;
	var displacementX;
	var displacementY;

	    /* Store Click Points */
	    dSecondLastPoint  = this.PIEdLastPoint;
	    aSecondLastPoint  = this.PIEaLastPoint;
	    this.PIEdLastPoint = new Point(dMouseX, dMouseY);
	    if (this.isPIEtransformEnabled()) this.PIEaLastPoint = pie.PIEdisplayToApplication(this.PIEdLastPoint);
	    else this.PIEaLastPoint = this.PIEdLastPoint;

	    if (this.PIEdefaultDrag)
	    {
	        displacementX = this.PIEdLastPoint.x - dSecondLastPoint.x;
	        displacementY = this.PIEdLastPoint.y - dSecondLastPoint.y;
	        /* Change Anchor Point */
	        dRoot.x = dRoot.x  + displacementX;
	        dRoot.y = dRoot.y  + displacementX;
	        /* Default Drag */
	        this.x = this.x + displacementX;
	        this.y = this.y + displacementY;

	        displacementX = this.PIEaLastPoint.x - aSecondLastPoint.x;
	        displacementY = this.PIEaLastPoint.y - aSecondLastPoint.y;
	        /* Change Anchor Point */
	        aRoot.x = aRoot.x  + displacementX;
	        aRoot.y = aRoot.y  + displacementX;
	    }

	    /* Now call application Listener with dislacements from last point */
	    if (aFunction != null) aFunction(this.PIEaLastPoint.x, this.PIEaLastPoint.y, this.PIEaLastPoint.x - aSecondLastPoint.x, this.PIEaLastPoint.y - aSecondLastPoint.y);
	}

	/*
	 * add DragListener(aDrag:Function)
	 * aDrag : Function
	 */
	p.addDragListener=function(aDrag)
	{
	    this.PIEaDrag = aDrag;
	}
	/*
	 * remove DragListener()
	 */
	p.removeDragListener=function()
	{
	    this.PIEaDrag = null;
	}
	/*
	 * Handle Drag(displayClickX:Number, displayClickY:Number)
	 * displayClickX - X coordinate of click in display space
	 * displayClickY - Y coordinate of click in display space
	 */
	p.handleDrag=function(displayClickX, displayClickY)
	{
	    /* Now call application Listener with transformed point */
	    this.transformAndCall(displayClickX, displayClickY, this.PIEaDrag);
	}

	/*
	 * add DropListener(dDrop:Function)
	 * aDrop : Function
	 */
	p.addDropListener=function(aDrop)
	{
	    this.PIEaDrop = aDrop;
	}
	/*
	 * remove DropListener()
	 */
	p.removeDropListener=function()
	{
	    this.PIEaDrop = null;
	}
		/*
	 * Handle Drop(displayClickX:Number, displayClickY:Number)
	 * displayClickX - X coordinate of click in display space
	 * displayClickY - Y coordinate of click in display space
	 */
	p.handleDrop=function(displayClickX, displayClickY)
	{
	    /* Now call application Listener with transformed point */
	    this.transformAndCall(displayClickX, displayClickY, this.PIEaDrop);
	}

	/*
	 * Set Fill(fillFlag:Boolean)
	 * fillFlag    - Flag to indicate fill
	 */
	p.setPIEfill=function(fillFlag)
	{
	    this.PIEfill = fillFlag;
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}
	/*
	 * Change Fill(fillColor:uint, fillOpacity:Number)
	 * fillColor   - Fill Color
	 * fillOpacity - Fill Opacity
	 */
	p.changeFill=function(fillColor, fillOpacity)
	{
	    this.PIEfill = true;
	    this.PIEfColor  = fillColor;
	    this.PIEfOpacity = fillOpacity;

	    /* Now draw the PIEsprite in display co-ordinates */
	    /*if (this.isPIEvisible()) {
	    	this.PIEcreateGraphics();
	    }*/ 
	}
	/*
	 * Get FillColor()
	 */
	p.getFillColor=function()
	{
	    return(this.PIEfColor);
	}
	/*
	 * Change Fill Color(fillColor:uint)
	 * fillColor   - Fill Color
	 */
	p.changeFillColor=function(fillColor)
	{
	    this.PIEfill = true;
	    this.PIEfColor  = fillColor;
	    /* Now draw the rectangle in display co-ordinates */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}

	/*
	 * Get FillOpacity()
	 */
	p.getFillOpacity=function()
	{
	    return(this.PIEfOpacity);
	}
	/*
	 * Change FillOpacity(fillOpacity:Number)
	 * fillOpacity - Fill Opacity
	 */
	p.changeFillOpacity=function(fillOpacity)
	{
	    this.PIEfill  = true;
	    this.PIEfOpacity = fillOpacity;

	    /* Now draw the rectangle in display co-ordinates */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}

	/*
	 * Set border(borderFlag:Boolean)
	 * borderFlag    - Flag to indicate border
	 */
	p.setPIEborder=function(borderFlag)
	{
	    this.PIEborder = borderFlag;
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}
	/*
	 * Change Border(borderWidth:Number, borderColor:uint, borderOpacity:Number)
	 * borderWidth   - Border Width
	 * borderColor    - Border Color
	 * borderOpacity - Border Opacity
	 */
	p.changeBorder=function(borderWidth, borderColor, borderOpacity)
	{
	    this.PIEborder = true;
	    this.PIEbWidth   = borderWidth;
	    this.PIEbColor   = borderColor;
	    this.PIEbOpacity = borderOpacity;

	    /* Now draw the rectangle in display co-ordinates */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}
	/*
	 * Get Border Width()
	 */
	p.getBorderWidth=function()
	{
	    return(this.PIEbWidth);
	}
	/*
	 * Change BorderWidth(borderWidth:uint)
	 * borderWidth   - Border Width
	 */
	p.changeBorderWidth=function(borderWidth)
	{
	    this.PIEborder = true;
	    this.PIEbWidth  = borderWidth;

	    /* Now draw the rectangle in display co-ordinates */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}
	/*
	 * Get BorderColor()
	 */
	p.getBorderColor=function()
	{
	    return(this.PIEbColor);
	}
	/*
	 * Change BorderColor(borderColor:uint)
	 * borderColor    - Border Color
	 */
	p.changeBorderColor=function(borderColor)
	{
	    this.PIEborder = true;
	    this.PIEbColor  = borderColor;

	    /* Now draw the rectangle in display co-ordinates */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}
	/*
	 * Get BorderOpacity()
	 */
	p.getBorderOpacity=function()
	{
	    return(this.PIEbOpacity);
	}
	/*
	 * Change BorderOpacity(borderOpacity:Number)
	 * borderOpacity - Border Opacity
	 */
	p.changeBorderOpacity=function(borderOpacity)
	{
	    this.PIEborder  = true;
	    this.PIEbOpacity = borderOpacity;

	    /* Now draw the rectangle in display co-ordinates */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}

	/*
	 * PIE CreateGraphics()
	 * To be overridden when inherited
	 */
	p.PIEcreateGraphics=function()
	{
		
	}

	/*
	 * changeLocation()
	 * To be overridden when inherited
	 */
	p.changeLocation=function(changeX, changeY)
	{
	}

	window.PIEsprite = PIEsprite;

}())
