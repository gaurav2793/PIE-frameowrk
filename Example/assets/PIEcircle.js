(function() {

	function PIEcircle(parentPie, centerX, centerY, radius, fillColor) {
		this.initialize(parentPie, centerX, centerY, radius, fillColor);
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


	var p = PIEcircle.prototype = inherit(PIEsprite.prototype);

	//PIEarrow.prototype = new createjs.Shape();

	p.PIEsprite_initialize = p.initialize; 

	p.pie;

	p.transformX;
	p.transformY;

	p.container;
	p.shape;

	/*
	 * Circle specific Parameters (in user co-ordinate space)
	 */ 
	p.aRadiusW;
	p.aRadiusH;
	/*
	 * Circle specific Parameters (in display co-ordinate space)
	 */ 
	p.dRadiusW;
	p.dRadiusH;

	p.aVertices = new Array();
	p.dVertices = new Array();

	/*
	 * Constructor for PIEcircle class 
	 * Parameters: (parentPie:PIE, centerX:Number, centerY:Number, radius:Number, fillColor:uint)
	 * parentPie - handle to the PIE Object
	 * centerX   - X Coordinates of center
	 * centerY   - Y Coordinates of center
	 * radius    - radius of circle
	 * fillColor - Fill color
	 */
	p.initialize=function(parentPie, centerX, centerY, radius, fillColor)
	{
		/* Call the constructor of Parent class */
	 	this.PIEsprite_initialize();

	    /* Store Original Parameters */
	    this.pie          = parentPie;
	    this.shape = new createjs.Shape();
	    this.container       = parentPie.experimentDisplay;
	    this.transformX  = this.container.width/2;
	    this.transformY  = this.container.height/2;
	    this.aRadiusW     = radius;
	    this.aRadiusH     = radius;
	    this.aRoot = (new createjs.Point(centerX, centerY));
	    this.PIEvisible = false;
	    this.aVertices[0] = new createjs.Point(centerX, centerY);

	    this.changeFill(fillColor, 1.0);
	    this.changeBorder(1, fillColor, 1.0);
	    this.setPIEborder(false);

	    /* Set default values of PIE sprite */
	    this.enablePIEtransform();
	    this.setPIEvisible();
	}

	/*
	 * Get Variable Methods
	 */
	/* Center X */
	p.getPIECenterX=function()
	{
	    return(this.dVertices[0].x);
	}
	/* Center Y */
	p.getPIECenterY=function()
	{
	    return(this.dVertices[0].y);
	}
	/* Radius */
	p.getPIEradius=function()
	{
	    return(this.dRadiusW);
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
	
	    if (this.isPIEtransformEnabled())
	    {
	        /* Transform to display co-ordinates */
	        this.dRadiusW    = (this.aRadiusW);
	        this.dRadiusH    = (this.aRadiusH);
	        this.dVertices[0] = new createjs.Point();
	        this.dVertices[0].x = this.transformX + this.aRoot.x;
	        this.dVertices[0].y = this.transformY + this.aRoot.y;
	    }
	    else
	    {
	        /* Copy application co-ordinates to display */
	        this.dRadiusW = this.aRadiusW;
	        this.dRadiusH = this.aRadiusH;
	        this.dVertices[0] = this.aRoot;
	    }

	    /* Draw if necessary */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}

	/*
	 * Draw Circle
	 * Parameters: (void)
	 */
	p.PIEcreateGraphics=function()
	{
	
	    this.shape.graphics.clear();   

	    if (this.PIEborder == true) this.shape.graphics.beginStroke(this.PIEbColor);   
	    if (this.PIEfill == true) this.shape.graphics.beginFill(this.PIEfColor);

	    this.shape.graphics.drawCircle(this.dVertices[0].x, this.dVertices[0].y, this.dRadiusW); 

	    if (this.PIEfill == true) this.shape.graphics.endFill();
	    this.pie.stage.update();
	}

	/*
	 * Change Circle Location
	 * Parameters: (centerX:Number , centerY:Number) 
	 * centerX   - X Coordinates of center
	 * centerY   - Y Coordinates of center
	 */
	p.changeLocation=function(centerX, centerY)
	{
	    /* Store Changed Location */
	    this.aRoot = (new createjs.Point(centerX, centerY));

	    /* Transform to display co-ordinates */
	    this.transformADtoD();
	    this.pie.stage.update();
	}

	/*
	 * Change circle size
	 * Parameters: (radius:Number)
	 * radius    - radius of circle
	 */
	p.changeSize=function(radius)
	{
	    /* Transform to  display co-ordinates */
	    this.aRadiusW = radius;
	    this.aRadiusH = radius;

	    /* Now draw the circle in display co-ordinates */
	    this.transformADtoD();
	    this.pie.stage.update();
	}

	window.PIEcircle = PIEcircle;

}())
