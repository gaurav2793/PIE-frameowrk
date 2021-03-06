(function() {
	
	function PIEregularPolygon(parentPie, firstPoint, secondPoint, vertices, fillColor) {
		this.initialize(parentPie, firstPoint, secondPoint, vertices, fillColor);
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


	var p = PIEregularPolygon.prototype = inherit(PIEsprite.prototype);

	//PIEarrow.prototype = new createjs.Shape();

	p.PIEsprite_initialize = p.initialize; 

	p.pie;

	p.transformX;
	p.transformY;

	p.container;
	p.shape;

	/*
	 * RegularPolygon.g specific Parameters (in user co-ordinate space)
	 */ 
	p.aOriginalCOG;
	p.aVertices;
	 
	p.dOriginalCOG;
	p.dVertices;

	p.PIEvNumber;
	p.PIEscale;

	/*
	 * Constructor for PIEregularPolygon class (regular RegularPolygon of given vertices and given first edge, constructed anticlockwise)
	 * Parameters: (parentPie:PIE, firstPoint:Point, vertices:uint, edge:Number, fillColor:uint)
	 * parentPie  - handle to the PIE Object
	 * firstPoint - Location of first point
	 * secondPoint - Location of second point
	 * vertices - Number of Vertices
	 * fillColor  - Fill color
	 */
	p.initialize=function(parentPie, firstPoint, secondPoint, vertices, fillColor)
	{
	var lIndex;
	var pEdge;
	var cAngle;
	var iAngle;

	    /* Store Original Parameters */
	    this.pie       = parentPie;
		this.shape = new createjs.Shape();
	    this.container       = parentPie.experimentDisplay;
	    this.transformX  = this.container.width/2;
	    this.transformY  = this.container.height/2;
	    this.PIEvNumber = vertices;
	    this.aVertices = new Array(this.PIEvNumber);
	    this.dVertices = new Array(this.PIEvNumber);
	    /* Compute regularPolygon edge, current angle and incremental angle */
	    pEdge  = Math.sqrt(((secondPoint.x - firstPoint.x) * (secondPoint.x - firstPoint.x)) + ((secondPoint.y - firstPoint.y) * (secondPoint.y - firstPoint.y)));
	    cAngle = ((((secondPoint.x - firstPoint.x) + pEdge) == 0) ? (Math.PI) : 2 * Math.atan((secondPoint.y - firstPoint.y)/((secondPoint.x - firstPoint.x) + pEdge)));
	    iAngle = (2 * Math.PI) / vertices;
	    /* Copy Vertices Data */
	    this.aVertices[0] = firstPoint;
	    this.aVertices[1] = secondPoint;
	    lIndex = 2;
	    while (lIndex < vertices)
	    {
	        cAngle = cAngle + iAngle;
	        this.aVertices[lIndex] = new createjs.Point((this.aVertices[lIndex-1].x + pEdge * Math.cos(cAngle)), (this.aVertices[lIndex-1].y + pEdge * Math.sin(cAngle)));
	        lIndex++;
	    }

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
	/* Vertices */
	p.getPIEvertices=function()
	{
	    return(this.dVertices);
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
	    this.stage.update();
	}

	/* Transform Control Methods */
	p.enablePIEtransform=function()
	{
		this.transformX = this.container.width/2;
		this.transformY = this.container.height/2;
		this.PIEtransform = true;
		this.transformAtoD();
	        this.stage.update();
	}

	p.disablePIEtransform=function()
	{
	    this.transformX = 0;
	    this.transformY = 0;
	    this.transformAtoD();
	    this.stage.update();
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
	 * Draw RegularPolygon.g
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
	 * Change RegularPolygon.g Location (new Vertex 1)
	 * Parameters: (topLeftX:Number , topLeftY:Number) 
	 * topLeftX   - new X Coordinates of Vertex1
	 * topLeftY   - new Y Coordinates of Vertex1
	 */
	p.changeLocation=function(topLeftX, topLeftY)
	{
	    /* Store Changed Location */
	    this.aVertices[0] = (new createjs.Point(topLeftX, topLeftY));

	    /* Transform Points */
	    this.transformADtoD();
	    this.pie.stage.update();
	}

	/*
	 * Change regularPolygon size
	 * Parameters: (tScale:Number)
	 * tScale - Scale of polygon (to original)
	 */
	p.changeSize=function(tScale)
	{
	    /* Store Changed Location */
	    this.PIEscale = tScale;

	    /* Draw always */
	    this.PIEcreateGraphics();
	    this.pie.stage.update();
	}


	window.PIEregularPolygon = PIEregularPolygon;

}())
