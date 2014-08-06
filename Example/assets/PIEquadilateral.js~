(function() {

	function PIEquadilateral(parentPie, vertex1, vertex2, vertex3, vertex4, fillColor) {
		this.initialize(parentPie, vertex1, vertex2, vertex3, vertex4, fillColor);
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


	var p = PIEquadilateral.prototype = inherit(PIEsprite.prototype);

	p.PIEsprite_initialize = p.initialize; 

	p.pie;

	p.transformX;
	p.transformY;

	p.container;
	p.shape;

	/*
	 * Quadrilateral specific Parameters (in user co-ordinate space)
	 */ 
	var aOriginalCOG;
	var aVertices;
	 
	var dOriginalCOG;
	var dVertices;

	var PIEvNumber;
	var PIEscale;

	p.initialize = function(parentPie, vertex1, vertex2, vertex3, vertex4, fillColor) {
		/* Store Original Parameters */
	    this.pie          = parentPie;
	    this.container = this.pie.experimentDisplay;
	    this.transformX = this.container.width/2;
	    this.transformY = this.container.height/2;
	    this.shape = new createjs.Shape();
	    this.PIEvNumber = 4;
	    this.aVertices = Array(this.PIEvNumber);
	    this.dVertices = Array(this.PIEvNumber);
	    this.aVertices[0] = vertex1;
	    this.aVertices[1] = vertex2;
	    this.aVertices[2] = vertex3;
	    this.aVertices[3] = vertex4;
	    this.aOriginalCOG = this.generateCOG();
	    this.PIEvisible = false;
	    this.changeFill(fillColor, 1.0);
	    this.changeBorder(1.0, fillColor, 1.0);
	    this.setPIEborder(false);
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
	p.getPIEvertex1=function()
	{
	    return(this.dVertices[0]);
	}
	/* Top Left Y */
	p.getPIEvertex2=function()
	{
	    return(this.dVertices[1]);
	}
	/* Width */
	p.getPIEvertex3=function()
	{
	    return(this.dVertices[2]);
	}
	/* Height */
	p.getPIEvertex4=function()
	{
	    return(this.dVertices[3]);
	}

	/*
	 * Override PIEsprite methods
	 */
	/* Visiblity Control Methods */
	p.setPIEvisible=function()
	{
	    this.PIEvisible = true;
	    this.PIEcreateGraphics();
	    this.stage.update();
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
	        	this.dVertices[lIndex] = new createjs.Point();
	            /* Transform to display co-ordinates */
	            this.dVertices[lIndex].x = this.aVertices[lIndex].x+this.transformX;
	            this.dVertices[lIndex].y = this.aVertices[lIndex].y+this.transformY;
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
	 * Draw Quadrilateral
	 * Parameters: (void)
	 */
	p.PIEcreateGraphics=function()
	{
	var lIndex;

	    this.shape.graphics.clear();
	    this.shape.graphics.moveTo((this.dVertices[0].x) * this.PIEscale, (this.dVertices[0].y) * this.PIEscale);

	    if (this.PIEborder) this.shape.graphics.beginStroke(this.PIEbColor);   
	    if (this.PIEfill) this.shape.graphics.beginFill(this.PIEfColor, this.PIEfOpacity);

	    lIndex = this.PIEvNumber;
	    while (lIndex > 0)
	    {
	        lIndex--;
	        this.shape.graphics.lineTo((this.dVertices[lIndex].x) * this.PIEscale, (this.dVertices[lIndex].y) * this.PIEscale);
	    }

	    if (this.PIEfill) this.shape.graphics.endFill();
	}

	/*
	 * Change Quadrilateral Location
	 * Parameters: (topLeftX:Number , topLeftY:Number) 
	 * topLeftX   - X Coordinates of top left corner
	 * topLeftY   - Y Coordinates of top left corner
	 */
	p.changeLocation=function(topLeftX, topLeftY)
	{
	    /* Store Changed Location */
	    //this.setRoot(new Point(topLeftX - aVertices[0].x + aOriginalCOG.x, topLeftY - aVertices[0].y + aOriginalCOG.y));
	    this.aVertices[0].x = topLeftX;
	    this.aVertices[0].y = topLeftY;

	    /* Transform Points */
	    this.transformADtoD();
	    this.pie.stage.update();
	}

	/*
	 * Change quadrilateral size
	 * Parameters: (quadrilateralW:Number, quadrilateralH:Number)
	 * quadrilateralW - width of quadrilateral
	 * quadrilateralH - height of quadrilateral
	 */
	p.changeSize=function(newScale)
	{
	    /* Store Changed Location */
	    this.PIEscale = newScale;

	    /* Draw if necessary */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	    this.pie.stage.update();
	}

	window.PIEquadilateral = PIEquadilateral;

}())
