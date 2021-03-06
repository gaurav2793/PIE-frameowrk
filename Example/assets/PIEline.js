(function() {

	function PIEline(parentPie, startX, startY, endX, endY, fillColor, lineT, lineO) {
		this.initialize(parentPie, startX, startY, endX, endY, fillColor, lineT, lineO);
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

	var p = PIEline.prototype = inherit(PIEsprite.prototype);

	p.PIEsprite_initialize = p.initialize; 

	p.shape;

	p.pie;	
	p.container;

	p.aOriginalCOG;
	p.aStart;
	p.aEnd;

	p.transformX;
	p.transformY;

	/*
	 * Line specific Parameters (in display co-ordinate space)
	 */
	p.dOriginalCOG;
	p.dStart;
	p.dEnd;

	p.PIEscale;

	/*
	 * Constructor for PIEline class 
	 * Parameters: (parentPie:PIE, startX:Number, startY:Number, endX:Number, endY:Number, fillColor:uint, lineT:Number, lineO:Number)
	 * parentPie - handle to the PIE Object
	 * startX    - X Coordinates of Start
	 * startY    - Y Coordinates of Start
	 * endX      - X Coordinates of End
	 * endY      - Y Coordinates of End
	 * fillColor - Fill color
	 * lineT     - thickness of line
	 * lineO     - opacity of line
	 */
	p.initialize = function(parentPie, startX, startY, endX, endY, fillColor, lineT, lineO) {
		
		/* Call the constructor of Parent class */
	 	this.PIEsprite_initialize();		


		var transformedPoint;
	    /* Store Original Location */
	    this.pie         = parentPie;
	    this.shape = new createjs.Shape();
	    this.container = this.pie.experimentDisplay;
	    this.aStart = new createjs.Point(startX, startY);
	    this.aEnd   = new createjs.Point(endX, endY);
	    this.aOriginalCOG = this.generateCOG();
	    this.aRoot = (this.aOriginalCOG);
	    this.transformX = this.container.width/2;
	    this.transformY = this.container.height/2;

	    this.setPIEinvisible();
	    this.changeFill(fillColor, 1.0);
	    this.setPIEfill(false);
	    this.changeBorder(lineT, fillColor, lineO);
	    this.PIEscale = 1.0;

	    /* Set default values of PIE sprite */
	    this.enablePIEtransform();
	    this.setPIEvisible();
	}

	/**
	 * Generate the COG of the shape
	 */
	p.generateCOG=function()
	{
	    return(new createjs.Point((this.aStart.x + this.aEnd.x) / 2, (this.aStart.y + this.aEnd.y) / 2));
	}

	/*
	 * Get Variable Methods
	 */
	/* Start X */
	p.getPIEstartX=function()
	{
	    return(this.dStart.x);
	}
	/* Start Y */
	p.getPIEstartY=function()
	{
	    return(this.dStart.y);
	}
	/* End X */
	p.getPIEendX=function()
	{
	    return(this.dEnd.x);
	}
	/* End Y */
	p.getPIEendY=function()
	{
	    return(this.dEnd.y);
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
	 */
	p.transformAtoD=function()
	{
	    this.transformALtoD();
	    this.transformADtoD();
	}

	/*
	 * This method transforms all variables from application co-ordinates to display co-ordinates
	 */
	p.transformALtoD=function()
	{
	}

	/*
	 * This method transforms all variables from application co-ordinates to display co-ordinates
	 */
	p.transformADtoD=function()
	{
		this.dStart = new createjs.Point(this.aStart.x+this.transformX, this.aStart.y+this.transformY);
		this.dEnd = new createjs.Point(this.aEnd.x+this.transformX, this.aEnd.y+this.transformY);
	   

	    /* Draw if necessary */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}

	/*
	 * Draw Line
	 * Parameters: (void)
	 */
	p.PIEcreateGraphics=function()
	{

	    this.shape.graphics.clear();
	    this.shape.graphics.moveTo((this.dStart.x) * this.PIEscale, (this.dStart.y) * this.PIEscale);

	    //if (this.PIEborder) this.shape.graphics.lineStyle(this.PIEbWidth, this.PIEbColor, this.PIEbOpacity);   
		this.shape.graphics.setStrokeStyle(this.PIEbWidth);
		this.shape.graphics.beginStroke(this.PIEbColor);
	    if (this.PIEfill) this.shape.graphics.beginFill(this.PIEfColor, this.PIEfOpacity);

	    this.shape.graphics.lineTo((this.dEnd.x) * this.PIEscale, (this.dEnd.y) * this.PIEscale);

	    if (this.PIEfill) this.shape.graphics.endFill();

	}

	/*
	 * Change Location
	 * Parameters: (changeX:Number, changeY:Number)
	 * changeX - X Coordinates of Change
	 * changeY - Y Coordinates of Change
	 */
	p.changeLocation=function(changeX, changeY)
	{
	    /* Store Changed Location */
		this.aStart.x = changeX;
		this.aStart.y = changeY;  

	    /* Transform to  display co-ordinates */
	    this.transformADtoD();
	    this.pie.stage.update();
	}

	/*
	 * Change Line 
	 * Parameters: (startX:Number, startY:Number, endX:Number, endY:Number) 
	 * startX - X Coordinates of Start
	 * startY - Y Coordinates of Start
	 * endX   - X Coordinates of End
	 * endY   - Y Coordinates of End
	 */
	p.changeLine=function(startX, startY, endX, endY)
	{
	    /* Store Changed Location */
	    this.aStart.x = startX;
	    this.aStart.y = startY;
	    this.aEnd.x   = endX;
	    this.aEnd.y   = endY;
	    this.aOriginalCOG = this.generateCOG();
	    this.aRoot = (this.aOriginalCOG);

	    /* Transform to  display co-ordinates */
	    this.transformAtoD();
	    this.pie.stage.update();
	}

	window.PIEline = PIEline;

}())
