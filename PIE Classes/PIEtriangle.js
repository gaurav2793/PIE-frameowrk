(function() {

	 function PIEtriangle(parentPie, v1, v2, v3, fillColor) {
	 	this.initialize(parentPie, v1, v2, v3, fillColor);
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


	var p = PIEtriangle.prototype = inherit(PIEsprite.prototype);

	p.PIEsprite_initialize = p.initialize; 

	p.pie;
	p.container;
	p.shape;

	p.transformX;
	p.transformY;

	/*
	 * Triangle.g specific Parameters (in user co-ordinate space)
	 */ 
	var aOriginalCOG;
	var aVertices;
	 
	var dOriginalCOG;
	var dVertices;

	var PIEvNumber;
	var PIEscale;

	/*
	 * Constructor for PIEtriangle class 
	 * Parameters: (parentPie:PIE, v1:Point, v2:Point, v3:Point, fillColor:uint)
	 * parentPie  - handle to the PIE Object
	 * v1 - First Vertex
	 * v2 - Second Vertex
	 * v3 - Third Vertex
	 * fillColor  - Fill color
	 */
	p.initialize=function(parentPie, v1, v2, v3, fillColor) {
		
		/* Call the constructor of Parent class */
	 	this.PIEsprite_initialize();

	 	/* Store Original Parameters */
	    this.pie       = parentPie;
	    this.container = parentPie.experimentDisplay;
	    this.shape = new createjs.Shape();
	    this.transformX = this.container.width/2;
	    this.transformY = this.container.height/2;
	    this.PIEvNumber = 3;
	    this.aVertices = new Array(this.PIEvNumber);
	    this.dVertices = new Array(this.PIEvNumber);
	    this.aVertices[0] = v1;
	    this.aVertices[1] = v2;
	    this.aVertices[2] = v3;
	    this.aOriginalCOG = this.generateCOG();
	    //this.aRoot = (this.aOriginalCOG);
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
	/* Vertex 1 */
	p.getPIEvertex1=function()
	{
	    return(new createjs.Point((this.dVertices[0].x), (this.dVertices[0].y)));
	}
	/* Vertex 2 */
	p.getPIEvertex2=function()
	{
	    return(new createjs.Point((this.dVertices[1].x), (this.dVertices[1].y)));
	}
	/* Vertex 3 */
	p.getPIEvertex3=function()
	{
	    return(new createjs.Point((this.dVertices[2].x), (this.dVertices[2].y )));
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
	 * This method transforms the first vertex (root) variables from application co-ordinates to display co-ordinates
	 * No graphics change is necessary
	 */
	p.transformALtoD=function()
	{
	}

	/*
	 * This method transforms all the vertex (drawing) variables (except root) from application co-ordinates to display co-ordinates
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
	 * Draw Triangle.g
	 * Parameters: (void)
	 */
	p.PIEcreateGraphics=function()
	{
	var lIndex;

		this.shape.graphics.clear();
	    this.shape.graphics.moveTo((this.dVertices[0].x) * this.PIEscale, (this.dVertices[0].y) * this.PIEscale);

	    //if (this.PIEborder) this.shape.graphics.lineStyle(this.PIEbWidth, this.PIEbColor, this.PIEbOpacity);   
	    if (this.PIEfill) this.shape.graphics.beginFill(this.PIEfColor);

	    if(this.PIEborder) this.shape.graphics.beginStroke(this.PIEbColor);

	    lIndex = this.PIEvNumber;
	    while (lIndex > 0)
	    {
	        lIndex--;
	        this.shape.graphics.lineTo((this.dVertices[lIndex].x) * this.PIEscale, (this.dVertices[lIndex].y) * this.PIEscale);
	    }

	    if (this.PIEfill) this.shape.graphics.endFill();
	}

	/*
	 * Change Triangle.g Location (new Vertex 1)
	 * Parameters: (topLeftX:Number , topLeftY:Number) 
	 * topLeftX   - new X Coordinates of Vertex1
	 * topLeftY   - new Y Coordinates of Vertex1
	 */
	p.changeLocation=function(topLeftX, topLeftY)
	{
	    /* Store Changed Location */
	    this.aVertices[0].x = topLeftX;
	    this.aVertices[1].y = topLeftY;

	    this.transformADtoD();
	    this.pie.stage.update();
	}

	/*
	 * Change triangle size
	 * Parameters: (tScale:Number)
	 * tScale - Scale of traingle (to orifginal)
	 */
	p.changeSize=function(tScale)
	{
	    /* Store Changed Location */
	    this.PIEscale = tScale;

	    /* Draw always */
	    this.PIEcreateGraphics();
	    this.pie.stage.update();
	}

	window.PIEtriangle = PIEtriangle;

}())
