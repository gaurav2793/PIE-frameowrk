(function() {

	function PIErectangle(parentPie, topLeftX, topLeftY, rectangleW, rectangleH, fillColor) {
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

	var p = PIErectangle.prototype = inherit(PIEsprite.prototype);

	/* variables */
    p.pie;
    p.container;
        
	p.PIEsprite_initialie = this.initialize;
        
    p.transformX;
    p.transformY;

	p.aOriginalCOG;
	p.aVertices;

	/* for drawing the rectangle */
	p.shape;
	 
	p.dOriginalCOG;
	p.dVertices;

	p.PIEvNumber;
	p.PIEscale;

	p.initialize = function(parentPie, topLeftX, topLeftY, rectangleW, rectangleH, fillColor) {
		/* Store Original Parameters */
	    this.pie          =     parentPie;
		this.shape = new createjs.Shape();
		this.container = this.pie.experimentDisplay;
	    this.transformX = this.container.width/2;
        this.transformY = this.container.height/2;
        this.PIEvNumber = 4;
	    this.aVertices = new Array(4);
	    this.dVertices = new Array(4);
	    this.aVertices[0] = new createjs.Point(topLeftX, topLeftY);
	    this.aVertices[1] = new createjs.Point(topLeftX + rectangleW, topLeftY);
	    this.aVertices[2] = new createjs.Point(topLeftX + rectangleW, topLeftY + rectangleH);
	    this.aVertices[3] = new createjs.Point(topLeftX, topLeftY + rectangleH);
	    this.aOriginalCOG = this.generateCOG();
	    this.aroot = (this.aOriginalCOG);
	    this.PIEfill = false;
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
	p.getPIErectangleX=function()
	{
            return(this.dVertices[0].x);
	    //return(this.aVertices[0].x + this.aRoot.x - this.aOriginalCOG.x);
	}
	/* Top Left Y */
	p.getPIErectangleY=function()
	{
            return this.dVertices[0].y;
	    //return(this.aVertices[0].y + this.aRoot.y - this.aOriginalCOG.y);
	}
	/* Width */
	p.getPIErectangleW=function()
	{
	    return(this.aVertices[1].x - this.aVertices[0].x);
	}
	/* Height */
	p.getPIErectangleH=function()
	{
	    return(this.aVertices[3].y - this.aVertices[0].y);
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
            this.PIEtransform = false;
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
	            this.dVertices[lIndex] = new createjs.Point(this.transformX + this.aVertices[lIndex].x, this.transformY + this.aVertices[lIndex].y);
	        }
	        else
	        {
	            /* Copy to display co-ordinates */
	            this.dVertices[lIndex] = this.aVertices[lIndex];
	        }
	    }

	    if (this.isPIEtransformEnabled()) { this.dOriginalCOG = this.pie.PIEapplicationToDisplay(this.aOriginalCOG); }
	    else { this.dOriginalCOG = this.aOriginalCOG; }

	    /* Draw if necessary */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}

	/*
	 * Draw Rectangle
	 * Parameters: (void)
	 */
	p.PIEcreateGraphics=function()
        {
		var lIndex;
		
		this.shape.graphics.clear();
                this.shape.graphics.moveTo((this.dVertices[0].x) * this.PIEscale, (this.dVertices[0].y) * this.PIEscale);
                if (this.PIEborder) this.shape.graphics.beginStroke( this.PIEbColor);   
                if (this.PIEfill) this.shape.graphics.beginFill(this.PIEfColor);

                lIndex = this.PIEvNumber;
                while (lIndex > 0)
                {
                    lIndex--;
                    this.shape.graphics.lineTo((this.dVertices[lIndex].x) * this.PIEscale, (this.dVertices[lIndex].y) * this.PIEscale);
                }

                if (this.PIEfill) this.shape.graphics.endFill();
               
                this.pie.stage.update(); 

       }

	/*
	 * Change Rectangle Location
	 * Parameters: (topLeftX:Number , topLeftY:Number) 
	 * topLeftX   - X Coordinates of top left corner
	 * topLeftY   - Y Coordinates of top left corner
	 */
	p.changeLocation=function(topLeftX, topLeftY)
	{
            var rectangleW = this.getPIErectangleW();
            var rectangleH = this.getPIErectangleH();
            
	    /* Store Changed Location */
            this.aVertices[0].x = topLeftX;
            this.aVertices[0].y = topLeftY;
            
	    /* Transform Points */
	    this.aVertices[0] = new createjs.Point(topLeftX, topLeftY);
	    this.aVertices[1] = new createjs.Point(topLeftX + rectangleW, topLeftY);
	    this.aVertices[2] = new createjs.Point(topLeftX + rectangleW, topLeftY + rectangleH);
	    this.aVertices[3] = new createjs.Point(topLeftX, topLeftY + rectangleH);
	    this.aOriginalCOG = this.generateCOG();
            this.transformAtoD();
            this.pie.stage.update();
	}

	/*
	 * Change rectangle size
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

	    this.aRoot = (new createjs.Point(this.aRoot.x - oldCOG.x + this.aOriginalCOG.x, this.aRoot.y - oldCOG.y + this.aOriginalCOG.y));
		
	    /* Transform Points */
	    this.transformALtoD();
	    this.transformADtoD();
	    this.pie.stage.update();
	}


	window.PIErectangle = PIErectangle;

}())
