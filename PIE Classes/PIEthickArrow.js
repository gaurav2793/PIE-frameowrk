(function() {

	function PIEthickArrow(parentPie,startX,startY,endX,endY,fillColor,arrowO) {
		this.initialize(parentPie,startX,startY,endX,endY,fillColor,arrowO);
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


	var p = PIEthickArrow.prototype = inherit(PIEsprite.prototype);

	p.PIEsprite_initialize = p.initialize; 

	p.pie;

	p.transformX;
	p.transformY;

	p.container;
	p.shape;

	var dThickness;
	/*
	 * ThickArrow specific Parameters (in user co-ordinate space)
	 */ 
	var aLength;
	var aAngle;
	/*
	 * ThickArrow specific Parameters (in display co-ordinate space)
	 */ 
	var dLength;
	var dAngle;

	/*
	 * Constructor for PIEthickArrow class 
	 * Parameters: (parentPie:PIE, startX:Number, startY:Number, endX:Number, endY:Number, fillColor:uint, arrowO:Number)
	 * parentPie - handle to the PIE Object
	 * startX    - X Coordinates of Start
	 * startY    - Y Coordinates of Start
	 * endX      - X Coordinates of End
	 * endY      - Y Coordinates of End
	 * fillColor - Fill color
	 * arrowO    - opacity of thickArrow
	 */
	p.initialize = function(parentPie, startX, startY, endX, endY, fillColor, arrowO)
	{
		/* Call the constructor of Parent class */
	 	this.PIEsprite_initialize();
	    /* Store Original Location */
	    this.pie         = parentPie;
	    this.shape = new createjs.Shape();
	    this.container = this.pie.experimentDisplay;
	    this.transformX  = this.stage.canvas.width/2;
	    this.transformY  = this.stage.canvas.height/2;
	    this.aRoot = (new createjs.Point(startX, startY));
	    this.aLength     = Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY));
	    this.aAngle      = ((((endX - startX) + this.aLength) == 0) ? (Math.PI) : 2 * Math.atan((endY - startY)/((endX - startX) + this.aLength)));
	    this.PIEvisible = false;
	    this.changeFill(fillColor, arrowO);
	    this.changeBorder(1.0, fillColor, 1.0);
	    this.setPIEborder(false);

	    /* Set default values of PIE sprite */
	    this.enablePIEtransform();
	    this.dThickness = (this.dLength / 10);
	    if (this.dThickness < 6) this.dThickness = 6;
	    if (this.dThickness > 20) this.dThickness = 20;
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
	    return(this.dRoot.x + this.dLength * Math.cos(this.dAngle));
	}
	/* End Y */
	p.getPIEendY=function()
	{
	    return(this.dRoot.y + this.dLength * Math.sin(this.dAngle));
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
	 * Draw ThickArrow
	 * Parameters: (void)
	 */
	p.PIEcreateGraphics=function()
	{
	    this.shape.graphics.clear();

	    //if (this.PIEborder) this.graphics.lineStyle(this.PIEbWidth, this.PIEbColor, this.PIEbOpacity);
		this.shape.setTransform(this.dRoot.x,this.dRoot.y);
	    if(this.PIEborder) {
		this.shape.graphics.beginStroke(this.PIEbColor);
		this.shape.graphics.setStrokeStyle(this.PIEbWidth);
	    }   
	    if (this.PIEfill) this.shape.graphics.beginFill(this.PIEfColor, this.PIEfOpacity);

	    if ((this.dLength < this.dThickness) && (this.dLength > 0))
	    {   /* Draw a rectangle */
		this.shape.graphics.drawRect(0, -(this.dThickness/2), this.dLength, this.dThickness); 
	    }
	    else if (this.dLength < (this.dThickness + 3))
	    {   /* Draw a triangle */
		this.shape.graphics.moveTo(0, -(this.dThickness/2));
		this.shape.graphics.lineTo(0, (this.dThickness/2));
		this.shape.graphics.lineTo(this.dLength, 0);
		this.shape.graphics.lineTo(0, -(this.dThickness/2));
	    }
	    else
	    {
		this.shape.graphics.moveTo(0, -(this.dThickness/2));
		this.shape.graphics.lineTo(0, (this.dThickness/2));
		this.shape.graphics.lineTo((this.dLength - this.dThickness), (this.dThickness/2));
		this.shape.graphics.lineTo((this.dLength - this.dThickness), (this.dThickness*3/2));
		this.shape.graphics.lineTo(this.dLength, 0);
		this.shape.graphics.lineTo((this.dLength - this.dThickness), (-(this.dThickness*3/2)));
		this.shape.graphics.lineTo((this.dLength - this.dThickness), (-(this.dThickness/2)));
		this.shape.graphics.lineTo(0, -(this.dThickness/2));
	    }

	    if (this.PIEfill) this.shape.graphics.endFill();

	    this.rotatePIEelement(this.dAngle);
	}

	/*
	 * Change Location
	 * Parameters: (changeX:Number, changeY:Number) 
	 * changeX - X Coordinates of Start
	 * changeY - Y Coordinates of Start
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
	 * cLength - Length of thickArrow
	 * cAngle  - Angle of thickArrow
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
	 * cAngle  - Angle of thickArrow
	 */
	p.changeAngle=function(cAngle)
	{
	    /* Only change the angle */
	    this.aAngle   = cAngle;
	    this.dAngle   = cAngle;
	    this.rotatePIEelement(this.dAngle);
	    this.pie.stage.update();
	}     

	/*
	 * Change Arrow thickness
	 * Parameters: (arrowT:Number)
	 * arrowT - thickness of arrow
	 */
	p.changeThickness=function(arrowT)
	{
	    this.dThickness = arrowT;
	 
	    /* Now draw the Arrow in display co-ordinates */
	    if (this.isPIEvisible()) this.PIEcreateGraphics();

	    this.pie.stage.update();
	}

	window.PIEthickArrow = PIEthickArrow;

}())
