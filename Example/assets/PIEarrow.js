(function() {
	
	function PIEarrow(parentPie,startX,startY,endX,endY,fillColor) {
		this.initialize(parentPie,startX,startY,endX,endY,fillColor);
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


	var p = PIEarrow.prototype = inherit(PIEsprite.prototype);

	//PIEarrow.prototype = new createjs.Shape();

	p.PIEsprite_initialize = p.initialize; 

	p.pie;

	p.transformX;
	p.transformY;

	p.container;
	p.shape;

	/*p.canvasId;
	p.context;*/

	/*
	 * Arrow specific Parameters (in user co-ordinate space)
	 */ 
	p.aLength;
	p.aAngle;
	/*
	 * Arrow specific Parameters (in display co-ordinate space)
	 */ 
	p.dLength;
	p.dAngle;

	p.fillColor;

	p.initialize=function(parentPie,startX, startY, endX, endY, fillColor) {
		/* Call the constructor of Parent class */
	 	this.PIEsprite_initialize();

	 	    /* Store Original Location */
	    this.pie         = parentPie;
		this.shape = new createjs.Shape();
	    this.container       = parentPie.experimentDisplay;
	    this.transformX  = this.container.width/2;
	    this.transformY  = this.container.height/2;
	    this.fillColor   = fillColor;
	    this.aLength     = Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));
	    this.aAngle      = ((((endX - startX) + this.aLength) == 0) ? (Math.PI) : 2 * Math.atan((endY - startY)/((endX - startX) + this.aLength)));
	    //this.setRoot(new createjs.Point(startX, startY));
this.aRoot = new createjs.Point(startX,startY);
	    this.changeFill(fillColor, 1.0);
	    this.setPIEfill(false);
	    this.changeBorder(1.0, fillColor, 1.0);

	    /* Set default values of PIE sprite */
	    
	    this.enablePIEtransform();
	    this.setPIEvisible();
	 }
	 
	 /*
	 * Get Variable Methods
	 */
	/* Start X */
	p.getPIEstartX=function()
	{
	    return(this.dRoot.x);
	}
	/* Start Y */
	p.getPIEstartY=function()
	{
	    return(this.dRoot.y);
	}
	/* End X */
	p.getPIEendX=function()
	{
	    return(this.dRoot.x + this.dLength * Math.cos(this.aAngle));
	}
	/* End Y */
	p.getPIEendY=function()
	{
	    return(this.dRoot.y + this.dLength * Math.sin(this.aAngle));
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

	var endX;
	var endY;
	var transformedPoint;

		this.dRoot.x = this.aRoot.x + this.transformX;
		this.dRoot.y = this.aRoot.y + this.transformY;
	    if (this.isPIEtransformEnabled())
	    {
	        /* Transform to display co-ordinates */
	        endX             = this.aRoot.x + this.aLength * Math.cos(this.aAngle);
	        endY             = this.aRoot.y + this.aLength * Math.sin(this.aAngle);
	        transformedPoint = (new createjs.Point(endX+this.transformX, endY+this.transformY));
	        endX             = transformedPoint.x;
	        endY             = transformedPoint.y;
	        this.dLength     = Math.sqrt((endX - this.dRoot.x) * (endX - this.dRoot.x) + (endY - this.dRoot.y) * (endY - this.dRoot.y));
	        this.dAngle      = ((((endX - this.dRoot.x) + this.dLength) == 0) ? (Math.PI) : 2 * Math.atan((endY - this.dRoot.y)/((endX - this.dRoot.x) + this.dLength)));
	    }
	    else
	    {
	        /* Copy application co-ordinates to display */
	        this.dLength = this.aLength;
	        this.dAngle  = this.aAngle;
	    }

	    /* Draw if necessary */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();
	}



	/*
	 * Draw Arrow
	 * Parameters: (void)
	 */
	p.PIEcreateGraphics=function()
	{
		var offset;

	    if (this.dLength < 10) offset = this.dLength;
	    else offset = Math.min(this.dLength * 0.1, 10);
	    this.shape.graphics.clear();
	      	
	    if(this.PIEfill)     this.shape.graphics.beginFill(this.fillColor);
	    if(this.PIEborder)   this.shape.graphics.beginStroke(this.fillColor);
	    
	    this.shape.setTransform(this.dRoot.x,this.dRoot.y);
	    this.shape.graphics.moveTo(0, 0);
	    this.shape.graphics.lineTo(this.dLength, 0);

	    this.shape.graphics.moveTo((this.dLength - offset), (offset / 2));
	    this.shape.graphics.lineTo(this.dLength, 0);
	    this.shape.graphics.lineTo((this.dLength - offset), (-offset / 2));
	    this.rotatePIEelement(this.dAngle);

	    
	}


	/*
	 * Change Arrow Location
	 * Parameters: (changeX:Number, changeY:Number) 
	 * startX - X Coordinates of Start
	 * startY - Y Coordinates of Start
	 */
	p.changeLocation=function(changeX, changeY)
	{
	    /* Store Changed Location */
	    this.aRoot = (new createjs.Point(changeX, changeY));

	    /* Transform to display co-ordinates */
	    this.transformADtoD();


	    this.pie.stage.update();
	}

	/*
	 * Change Arrow
	 * Parameters: (startX:Number, startY:Number, endX:Number, endY:Number) 
	 * startX - X Coordinates of Start
	 * startY - Y Coordinates of Start
	 * endX   - X Coordinates of End
	 * endY   - Y Coordinates of End
	 */
	p.changeArrow=function(startX, startY, endX, endY)
	{
	    /* Store Changed Location */
	    this.aRoot = (new createjs.Point(startX, startY));
	    this.aLength     = Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));
	    this.aAngle      = ((((endX - startX) + this.aLength) == 0) ? (Math.PI) : 2 * Math.atan((endY - startY)/((endX - startX) + this.aLength)));

	    /* Transform to display co-ordinates */
	    this.transformADtoD();

this.pie.stage.update();
	}

	/*
	 * Change Arrow Polar Coordinates
	 * Parameters: (startX:Number, startY:Number, cLength:Number, cAngle:Number)
	 * startX  - X Coordinates of Start
	 * startY  - Y Coordinates of Start
	 * cLength - Length of Arrow
	 * cAngle  - Angle of Arrow (+ve clockwise)
	 */
	p.changePolarCoordinates=function(startX, startY, cLength, cAngle)
	{
	    /* Store Changed Location */
	    this.aRoot = (new createjs.Point(startX, startY));
	    this.aLength     = cLength;
	    this.aAngle      = cAngle;

	    /* Transform to display co-ordinates */
	    this.transformADtoD();

	    this.pie.stage.update();
	}

	/*
	 * Change Arrow Angle
	 * Parameters: (cAngle:Number) 
	 * cAngle  - Angle of Arrow (+ve clockwise)
	 */
	p.changeAngle=function(cAngle)
	{
	    /* Only change the angle */
	    this.aAngle   = cAngle;
	    this.dAngle   = cAngle;
	    this.rotatePIEelement(this.dAngle);
	    this.pie.stage.update();
	}

	window.PIEarrow = PIEarrow;

}())
