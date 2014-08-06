(function() {

	function PIEarc(parentPie, centerX, centerY, startX, startY, angleDifference, fillColor) {
		this.initialize(parentPie, centerX, centerY, startX, startY, angleDifference, fillColor);
	}

	function inherit(p) {
		if (p == null) throw TypeError(); // p must be a non-null object
		if (Object.create) // If Object.create() is defined...
		return Object.create(p); // then just use it.
		var t = typeof p; // Otherwise do some more type checking
		if (t !== "object" && t !== "function") throw TypeError();
		function f() {}; // Define a dummy constructor function.
		f.prototype = p; // Set its prototype property to p.
		return new f(); // Use f() to create an "heir" of p.
	}


	var p = PIEarc.prototype = inherit(PIEsprite.prototype);

	//PIEarrow.prototype = new createjs.Shape();

	p.PIEsprite_initialize = p.initialize; 

	p.pie;

	p.transformX;
	p.transformY;

	p.container;
	p.shape;

	/*
	 * Arc specific Parameters (in user co-ordinate space)
	 */ 
	p.aRadius;
	p.aStartAngle;
	p.aArcAngle;
	/*
	 * Arc specific Parameters (in display co-ordinate space)
	 */ 
	p.dRadius;
	p.dStartAngle;
	p.dArcAngle;

	p.aVertices;
	p.dVertices;

	/*
	 * Constructor for PIEarc class 
	 * Parameters: (parentPie:PIE, centerX:Number, centerY:Number, startX:Number, startY:Number, dAngle:Number, fillColor:uint)
	 * parentPie - handle to the PIE Object
	 * centerX   - X Coordinates of center
	 * centerY   - Y Coordinates of center
	 * startX    - X Coordinates of start point
	 * startY    - Y Coordinates of start point
	 * angleDifference - angle of arc (+ve clockwise)
	 * fillColor - Fill color
	 */

	p.initialize=function(parentPie, centerX, centerY, startX, startY, angleDifference, fillColor) {
		/* Store Original Parameters */
	    this.PIEsprite_initialize();
	    this.pie          = parentPie;
	    this.shape = new createjs.Shape();
	    this.container       = parentPie.experimentDisplay;
	    this.transformX  = this.container.width/2;
	    this.transformY  = this.container.height/2;
	    this.aVertices = new Array(1);
	    this.dVertices = new Array(1);
	    this.aRadius      = Math.sqrt((startX - centerX) * (startX - centerX) + (startY - centerY) * (startY - centerY));
	    this.aStartAngle  = ((((startX - centerX) + this.aRadius) == 0) ? (Math.PI) : 2 * Math.atan((startY - centerY)/((startX - centerX) + this.aRadius)));
	    this.aArcAngle    = angleDifference;
		this.aVertices[0] = new createjs.Point(centerX, centerY);
	    this.PIEvisible = false;

	    this.changeFill(fillColor, 1.0);
	    this.setPIEfill(false);
	    this.changeBorder(1, fillColor, 1.0);

	    /* Set default values of PIE sprite */
	    this.enablePIEtransform();
	    this.setPIEvisible();
	}

	/*
	 * Get Variable Methods
	 */
	/* Center X */
	p.getPIEcenterX=function()
	{
	    return(this.dRoot.x);
	}
	/* Center Y */
	p.getPIEcenterY=function()
	{
	    return(this.dRoot.y);
	}
	/* Start Angle */
	p.getPIEstartAngle=function()
	{
	    return(this.dStartAngle);
	}
	/* End Angle */
	p.getPIEendAngle=function()
	{
	    return(this.dStartAngle + this.dArcAngle);
	}
	/* Arc Angle */
	p.getPIEarcAngle=function()
	{
	    return(this.dArcAngle);
	}

	/*
	 * Override PIEsprite methods
	 */
	/* Visiblity Control Methods */
	p.setPIEvisible=function()
	{
	    this.PIEvisible = true;
	    this.PIEcreateGraphics();
	    this.pie.stage.update();
	}
	p.setPIEinvisible=function()
	{
	    this.PIEvisible = false;
	    this.shape.graphics.clear();
	    this.pie.stage.update();
	}

	/* Transform Control Methods */
	p.enablePIEtransform=function()
	{
		this.transformX = this.container.width/2;
		this.transformY = this.container.height/2;
		this.PIEtransform = true;
		this.transformAtoD();
	        this.pie.stage.update();
	}

	p.disablePIEtransform=function()
	{
	    this.transformX = 0;
	    this.transformY = 0;
	    this.transformAtoD();
	    this.pie.stage.update();
	}

	/*
	 * This method transforms all variables from application co-ordinates to display co-ordinates
	 * It calls two separate methods to change location and graphics (drawing) variables
	 */
	p.transformAtoD=function()
	{
	    this.transformALtoD();
	    this.transformADtoD();
	}

	/*
	 * This method transforms the location variables from application co-ordinates to display co-ordinates
	 * The graphics is not changed
	 */
	p.transformALtoD=function()
	{
	}

	/*
	 * This method transforms the size (drawing) variables from application co-ordinates to display co-ordinates
	 * The graphics is changed appropriately
	 */
	p.transformADtoD=function()
	{
	var sPoint;
	var ePoint;
	var tLength;
	this.dRadius = this.aRadius;
	this.dStartAngle = this.aStartAngle*Math.PI/180;
	this.dArcAngle = this.aArcAngle;

	    if (this.isPIEtransformEnabled())
	    {
		this.dRoot.x = this.aRoot.x+this.transformX;
		this.dRoot.y = this.aRoot.y+this.transformY;
this.dVertices[0]= this.dRoot;
	        /* Calculate new Application Points */
	        sPoint = new createjs.Point(0,0);
	        sPoint.x = this.aRoot.x + this.aRadius * Math.cos(this.aStartAngle);
	        sPoint.y = this.aRoot.y + this.aRadius * Math.sin(this.aStartAngle);
	        ePoint = new createjs.Point(0,0);
	        ePoint.x = this.aRoot.x + this.aRadius * Math.cos(this.aStartAngle + this.aArcAngle);
	        ePoint.y = this.aRoot.y + this.aRadius * Math.sin(this.aStartAngle + this.aArcAngle);

	        /* Transform to display co-ordinates */
	        //sPoint = pie.PIEapplicationToDisplay(sPoint);
	        sPoint.x = sPoint.x+this.transformX;
	        sPoint.y = sPoint.y+this.transformY;
	        //ePoint = pie.PIEapplicationToDisplay(ePoint);
	        ePoint.x = ePoint.x+this.transformX;
	        ePoint.y = ePoint.y+this.transformY;
	        //this.dRadius = Math.sqrt((sPoint.x - this.dRoot.x) * (sPoint.x - this.dRoot.x) + (sPoint.y - this.dRoot.y) * (sPoint.y - this.dRoot.y));
	       // this.dStartAngle = ((((sPoint.x - this.dRoot.x) + this.dRadius) == 0) ? (Math.PI) : 2 * Math.atan((sPoint.y - this.dRoot.y)/((sPoint.x - this.dRoot.x) + this.dRadius)));
	        //this.dArcAngle   = ((((ePoint.x - this.dRoot.x) + this.dRadius) == 0) ? (Math.PI) : 2 * Math.atan((sPoint.y - this.dRoot.y)/((ePoint.x - this.dRoot.x) + this.dRadius))) - this.dStartAngle;
	    }
	    else
	    {
		this.dVertices[0]= this.aVertices[0];
	        /* Copy application co-ordinates to display */
	        this.dRadius     = this.aRadius;
	        this.dStartAngle = this.aStartAngle;
	        this.dArcAngle   = this.aArcAngle;
	    }

	    /* Draw if necessary */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	    this.pie.stage.update();
	}

	/*
	 * Draw Arc
	 * Parameters: (void)
	 */
	p.PIEcreateGraphics=function()
	{
	var steps;
	var iAngle;
	var theta;
	var nextX;
	var nextY;

	    this.shape.graphics.clear();   

	    if (this.PIEborder) this.shape.graphics.beginStroke(this.PIEbColor);   
	    if (this.PIEfill) this.shape.graphics.beginFill(this.PIEfColor);

	    
		this.dRoot = this.dVertices[0];
	    this.shape.graphics.arc(this.dRoot.x, this.dRoot.y, this.dRadius, this.dStartAngle, this.dArcAngle, false);

	    if (this.PIEfill) this.shape.graphics.endFill();
	
	    this.pie.stage.update();
	}

	/*
	 * Change Arc Location
	 * Parameters: (centerX:Number , centerY:Number) 
	 * centerX   - X Coordinates of center
	 * centerY   - Y Coordinates of center
	 */
	p.changeLocation=function(centerX, centerY)
	{
	    /* Store Changed Location */
	    this.aVertices[0] = (new createjs.Point(centerX, centerY));

	    /* Transform to display co-ordinates */
	    this.transformADtoD();
	    this.pie.stage.update();
	}

	/*
	 * Change arc size
	 * Parameters: (radius:Number)
	 * radius    - radius of arc
	 */
	p.changeSize=function(radius)
	{
	    /* Transform to  display co-ordinates */
	    this.aRadius = radius;

	    /* Now draw the arc in display co-ordinates */
	    this.transformADtoD();
	    this.pie.stage.update();
	}

	/*
	 * Change arc angles
	 * Parameters: (sAngle:Number, eAngle:Number)
	 * sAngle    - Start angle
	 * eAngle    - Arc angle
	 */
	p.changeAngles=function(sAngle, aAngle)
	{
	    /* Transform to  display co-ordinates */
	    this.aStartAngle = sAngle;
	    this.aArcAngle   = aAngle;

	    /* Now draw the arc in display co-ordinates */
	    this.transformADtoD();
	    this.pie.stage.update();
	}

	window.PIEarc = PIEarc; 

}())
