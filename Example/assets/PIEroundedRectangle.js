(function() {

	function PIEroundedRectangle(parentPie, topLeftX, topLeftY, rectangleW, rectangleH, fillColor) {
		this.initialize(parentPie, topLeftX, topLeftY, rectangleW, rectangleH, fillColor);
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


	var p = PIEroundedRectangle.prototype = inherit(PIEsprite.prototype);

	//PIEarrow.prototype = new createjs.Shape();

	p.PIEsprite_initialize = p.initialize; 

	p.pie;

	p.transformX;
	p.transformY;

	p.container;
	p.shape;

	p.borderRadius;
	/*
	 * RoundedRectangle specific Parameters (in user co-ordinate space)
	 */ 
	p.aOriginalCOG;
	p.aVertices;
	 
	p.dOriginalCOG;
	p.dVertices;

	p.PIEvNumber;
	p.PIEscale;

	/*
	 * Constructor for PIEroundedRectangle class 
	 * Parameters: (parentPie:PIE, topLeftX:Number, topLeftY:Number, rectangleW:Number, rectangleH:Number, fillColor:uint)
	 * parentPie  - handle to the PIE Object
	 * topLeftX   - X Coordinates of top left corner
	 * topLeftY   - Y Coordinates of top left corner
	 * rectangleW - width of rectangle
	 * rectangleH - height of rectangle
	 * fillColor  - Fill color
	 */
	p.initialize=function(parentPie, topLeftX, topLeftY, rectangleW, rectangleH, fillColor)
	{
	    /* Store Original Parameters */
	    this.PIEsprite_initialize();
	    this.pie          = parentPie;
	    this.PIEvNumber = 4;
	    this.container = this.pie.experimentDisplay;
	    this.shape = new createjs.Shape();
	    this.transformX = this.container.width/2;
	    this.transformY = this.container.height/2;
	    this.aVertices = new Array(this.PIEvNumber);
	    this.dVertices = new Array(this.PIEvNumber);
	    this.aVertices[0] = new createjs.Point(topLeftX, topLeftY);
	    this.aVertices[1] = new createjs.Point(topLeftX + rectangleW, topLeftY);
	    this.aVertices[2] = new createjs.Point(topLeftX + rectangleW, topLeftY + rectangleH);
	    this.aVertices[3] = new createjs.Point(topLeftX, topLeftY + rectangleH);
	    this.aOriginalCOG = this.generateCOG();
	    this.PIEvisible = false;
	    this.changeFill(fillColor, 1.0);
	    this.changeBorder(2, fillColor, 1.0);
	    this.setPIEborder(false);
	    this.PIEscale = 1.0;

	    /* set the default border radius and width */
	    this.borderRadius = Math.max(Math.min((rectangleW / 50), (rectangleH / 50)), 2);

	    /* Set default values of PIE sprite */
	    this.enablePIEtransform();
	    this.setPIEvisible();
	}

	/**
	 * Generate the COG of the shape
	 */
	p.generateCOG=function()
	{
	var lIndex;
	var averageX;
	var averageY;

	    averageX = 0;
	    averageY = 0;
	    lIndex = this.PIEvNumber;
	    while (lIndex > 0)
	    {
	        lIndex--;
	        averageX = averageX + this.aVertices[lIndex].x;
	        averageY = averageY + this.aVertices[lIndex].y;
	    }
	    return(new createjs.Point(averageX / this.PIEvNumber, averageY / this.PIEvNumber));
	}

	/*
	 * Get Variable Methods
	 */
	/* Top Left X */
	p.getPIErectangleX=function()
	{
	    return(this.dVertices[0].x);
	}
	/* Top Left Y */
	p.getPIErectangleY=function()
	{
	    return(this.dVertices[0].y);
	}
	/* Width */
	p.getPIErectangleW=function()
	{
	    return(this.dVertices[2].x);
	}
	/* Height */
	p.getPIErectangleH=function()
	{
	    return(this.dVertices[2].y);
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
	var lIndex;

	    lIndex = this.PIEvNumber;
	    while (lIndex > 0)
	    {
	        lIndex--;
	        if (this.isPIEtransformEnabled())
	        {
	            /* Transform to display co-ordinates */
	            this.dVertices[lIndex] = new createjs.Point();
	            this.dVertices[lIndex].x = (this.aVertices[lIndex].x + this.transformX);
	            this.dVertices[lIndex].y = (this.aVertices[lIndex].y + this.transformY);
	        }
	        else
	        {
	            /* Copy to display co-ordinates */
	            this.dVertices[lIndex] = this.aVertices[lIndex];
	        }
	    }

	    /* Draw if necessary */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}

	/*
	 * Draw Rounded Rectangle
	 * Parameters: (void)
	 */
	p.PIEcreateGraphics=function()
	{
	    this.shape.graphics.clear();

	    if (this.PIEborder) this.shape.graphics.beginStroke(this.PIEbColor);   
	    if (this.PIEfill) this.shape.graphics.beginFill(this.PIEfColor);   
	   	
	    this.shape.graphics.drawRoundRect((this.dVertices[0].x) * this.PIEscale, (this.dVertices[0].y) * this.PIEscale, (this.dVertices[2].x - this.dVertices[0].x) * this.PIEscale, (this.dVertices[2].y - this.dVertices[0].y) * this.PIEscale, this.borderRadius);     

	    if (this.PIEfill) this.shape.graphics.endFill();
	}

	/*
	 * Change Rounded Rectangle Location
	 * Parameters: (topLeftX:Number , topLeftY:Number) 
	 * topLeftX   - X Coordinates of top left corner
	 * topLeftY   - Y Coordinates of top left corner
	 */
	p.changeLocation=function(topLeftX, topLeftY)
	{
	    /* Store Changed Location */
	    this.aVertices[0] = (new createjs.Point(topLeftX , topLeftY));

	    /* Transform Points */
	    this.transformADtoD();
	    this.pie.stage.update();
	}

	/*
	 * Change Rounded rectangle size
	 * Parameters: (rectangleW:Number, rectangleH:Number)
	 * rectangleW - width of rectangle
	 * rectangleH - height of rectangle
	 */
	p.changeSize=function(rectangleW, rectangleH)
	{
	var oldCOG;

	    /* Store Changed Location */
		oldCOG = this.aOriginalCOG;
	    this.aVertices[1].x = this.aVertices[0].x + rectangleW;
	    this.aVertices[2].x = this.aVertices[0].x + rectangleW;
	    this.aVertices[2].y = this.aVertices[0].y + rectangleH;
	    this.aVertices[3].y = this.aVertices[0].y + rectangleH;
	    this.aOriginalCOG = this.generateCOG();
		

	    /* Transform Points */
	    this.transformALtoD();
	    this.transformADtoD();
	    this.pie.stage.update();
	}

	/*
	 * Change Rounded Rectangle Border Radius
	 * Parameter: (borderRadius:Number)
	 */
	p.changeBorderRadius=function(borderRadius)
	{
	    this.borderRadius = borderRadius;

	    /* Now draw  the Rounded rectangle in display co-ordinates */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	    this.pie.stage.update();
	}

	window.PIEroundedRectangle = PIEroundedRectangle;

}())
