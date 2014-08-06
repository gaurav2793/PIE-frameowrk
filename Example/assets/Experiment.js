(function() {
	
	/* TestProject Framework Handle */
	var pieHandle;

	/**
	 *
	 * This section contains Physics Parameters
	 *
	 */
	var PIEaspectRatio;
	var worldOriginX;
	var worldOriginY;
	var worldWidth;
	var worldHeight;
	var originP;
	var pOrbit = new Array(5);

	/**
	 *
	 * This section contains Drawing Objects
	 *
	 */
	

	/* Index of Planets */
	var PIEobjects=5;
	var SUN=0;
	var MERCURY=1;
	var VENUS=2;
	var EARTH=3;
	var MARS=4;

	/* Vectors to store values */
	var nameVector=new Array();
	var colorVector=new Array();
	var radiusVector=new Array();
	var periodVector=new Array();
	var omegaVector=new Array();
	var angleVector=new Array();
	var objectVector=new Array();
	var sizeVector=new Array();
	var massVector=new Array();
	var selfRotateVector=new Array();
	var checks = new Array();

	function Experiment(pie	) {
		/* Store handle of PIE Framework */
		pieHandle = pie;

		/* Call a PIE framework function to set the dimensions of the drawing area, right panel and bottom panel */
		/* We will reserve 100% width and 100%height for the drawing area */
		pieHandle.PIEsetDrawingArea(0.75,1.0);

		/* Set the Experiment Details */
		pieHandle.showExperimentName("Solar System (Four Planets)");
		pieHandle.showDeveloperName("Gaurav Arora and Aayushi Agrawal");

		/* Initialise World Origin and Boundaries */
		fillPlanetData();

		/* Initialise World Origin and Boundaries */
		resetWorld();

		/* define the position of all the global (static) variables */
		/* Code in a single Function (recommended) for reuse */
		resetExperiment();

		/* Create Control Objects for Pause/Resume/Reset/speed control */
		pieHandle.PIEcreateResetButton();
		pieHandle.ResetControl.addClickListener(resetExperiment);
		pieHandle.PIEcreatePauseButton();
		pieHandle.PauseControl.addClickListener(PauseAndResume);
		//pieHandle.PIEcreateSpeedButtons();

		/* The PIE framework provides default pause/play/reset buttons in the bottom panel */
		/* If you need any more experiment control button such as next frame etc., call the function code here */
		/* Create Experiment Objects */
		createExperimentObjects();
	}
	
	function PauseAndResume() 
	{
	    if (!createjs.Ticker.getPaused())
	    {
	        if (pieHandle.PauseControl != null) pieHandle.PauseControl.label = "Resume";
	        createjs.Ticker.setPaused(true);
	        createjs.Ticker.removeEventListener("tick", nextFrame);
	    }
	    else
	    {
	        if (pieHandle.PauseControl != null) pieHandle.PauseControl.label = "Pause";
	        createjs.Ticker.setPaused(false);
	        createjs.Ticker.addEventListener("tick", nextFrame);
	    }
	 }
	
	/**
	 * This function resets the world boundaries and adjusts display to match the world boundaries
	 */
	function resetWorld()
	{
		/* get the PIE drawing area aspect ratio (width/height) to model the dimensions of our experiment area */
		PIEaspectRatio = pieHandle.PIEgetDrawingAspectRatio();

		/* Initialise World Origin and Boundaries */
		if (PIEaspectRatio >= 1.0)
		{   /* Width > Height */
			worldHeight  = radiusVector[MARS] * 2.002;    /* To accomodate Saturn */
			worldWidth   = worldHeight * PIEaspectRatio;    /* match world aspect ratio to PIE aspect ratio */
		}
		else
		{   /* Width < Height */
			worldWidth   = radiusVector[MARS] * 2.002;    /* To accomodate Saturn */
			worldHeight  = worldWidth / PIEaspectRatio;     /* match world aspect ratio to PIE aspect ratio */
		}
		worldOriginX = (-worldWidth/2);               /* Origin at center */
		worldOriginY = ( -worldHeight / 2);

		/* Match display to Universe */
		pieHandle.PIEsetApplicationBoundaries(worldOriginX,worldOriginY,worldWidth,worldHeight);
	}

	
	/**
	 *
	 * This function is called by the PIE framework to reset the experiment to default values
	 * It defines the values of all the global (static) variables
	 *
	 */
	function resetExperiment()
	{
		/* Initialise Physics Parameters */
		angleVector[SUN]     = 0.0;
		angleVector[MERCURY] = (2 * Math.PI);
		angleVector[VENUS]   = (2 * Math.PI) / 4;
		angleVector[EARTH]   = (2 * Math.PI) * 2 / 4;
		angleVector[MARS]    = (2 * Math.PI) * 3 / 4;
		
		if(checks[1]) {
			objectVector[1].setPIEinvisible();
			checks[1].setPIEcheckBoxStatus(false);
		}
		if(checks[2]) {
			objectVector[2].setPIEinvisible();
			checks[2].setPIEcheckBoxStatus(false);
		}
		if(checks[3]) {
			objectVector[3].setPIEinvisible();
			checks[3].setPIEcheckBoxStatus(false);
		}
		if(checks[4]) {
			objectVector[4].setPIEinvisible();
			checks[4].setPIEcheckBoxStatus(false);
		}
		/* Restart Timer */
		//pieHandle.PIEresumeTimer();
		//pieHandle.PIEsetDelay(100);
	}
	
	/**
	 * This function fills the palnet data used for creating the simulation
	 */
	function fillPlanetData()
	{
		/* Create Vectors */
		this.PIEobjects = 5;
		colorVector  = new Array(this.PIEobjects);
		radiusVector = new Array(this.PIEobjects);
		periodVector = new Array(this.PIEobjects);
		omegaVector  = new Array(this.PIEobjects);
		angleVector  = new Array(this.PIEobjects);
		objectVector = new Array(this.PIEobjects);
		sizeVector   = new Array(this.PIEobjects);
		massVector   = new Array(this.PIEobjects);
		selfRotateVector = new Array(this.PIEobjects);
		
		/* Set Default Names */
		nameVector[SUN]     = "Sun";
		nameVector[MERCURY] = "Mercury";
		nameVector[VENUS]   = "Venus";
		nameVector[EARTH]   = "Earth"
		nameVector[MARS]    = "Mars";

		/* Set Default Colors */
		colorVector[SUN]     = "#FFFF44";
		colorVector[MERCURY] = "#44FF44";
		colorVector[VENUS]   = "#FF44FF";
		colorVector[EARTH]   = "#4444FF";
		colorVector[MARS]    = "#FF4444";

		/* Set Default Radius (Lakh Km) */
		radiusVector[SUN]     = 0.0;
		radiusVector[MERCURY] = 57.1;
		radiusVector[VENUS]   = 108.0;
		radiusVector[EARTH]   = 149.0;
		radiusVector[MARS]    = 227.4;

		/* Set Default Periods (days) */
		periodVector[SUN]     = 0.0;
		periodVector[MERCURY] = 87.97;
		periodVector[VENUS]   = 224.7;
		periodVector[EARTH]   = 365.26;
		periodVector[MARS]    = 686.98;

		/* Set Default Omega (angle/ per day) */
		omegaVector[SUN]     = 0.0;
		omegaVector[MERCURY] = (2 * Math.PI) / periodVector[MERCURY];
		omegaVector[VENUS]   = (2 * Math.PI) / periodVector[VENUS];
		omegaVector[EARTH]   = (2 * Math.PI) / periodVector[EARTH];
		omegaVector[MARS]    = (2 * Math.PI) / periodVector[MARS];

		/* Set Default Start Angles */
		angleVector[SUN]     = 0.0;
		angleVector[MERCURY] = (2 * Math.PI);
		angleVector[VENUS]   = (2 * Math.PI) / 4;
		angleVector[EARTH]   = (2 * Math.PI) * 2 / 4;
		angleVector[MARS]    = (2 * Math.PI) * 3 / 4;

		/* Set Default Sizes (in 1000 km) */
		sizeVector[SUN]     = 10.0;
		sizeVector[MERCURY] = 2.44;
		sizeVector[VENUS]   = 6.052;
		sizeVector[EARTH]   = 6.378;
		sizeVector[MARS]    = 3.397;

		/* Set Default Masses (in 10**23 kg) */
		massVector[SUN]     = 19900000.0;
		massVector[MERCURY] = 3.3;
		massVector[VENUS]   = 48.7;
		massVector[EARTH]   = 59.7;
		massVector[MARS]    = 6.42;

		/* Set Default Self Rotation (in days) */
		selfRotateVector[SUN]     = 24.6;
		selfRotateVector[MERCURY] = 58.6
		selfRotateVector[VENUS]   = -243.0;
		selfRotateVector[EARTH]   = 0.99;
		selfRotateVector[MARS]    = 1.03;
	}
	
	/**
	 *
	 * This function is called to create the experiment objects
	 * It calls the appropriate constructors to create drawing objects
	 * It also sets callback variables to point to callback code
	 *
	 */
	function createExperimentObjects()
	{
	var lIndex;
	var lSize;
	var lRadius;
	

		originP = new createjs.Point(0, 0);
		lIndex = 1;
		while (lIndex < this.PIEobjects)
		{
			lRadius = radiusVector[lIndex];
			lSize = sizeVector[lIndex];
			
			objectVector[lIndex] = new PIEarc(pieHandle, radiusVector[lIndex], 0, radiusVector[lIndex]+lSize*2.3, 0, 2*Math.PI,colorVector[lIndex]);
			objectVector[lIndex].setPIEfill(true);
			objectVector[lIndex].setPIEborder(true);
			objectVector[lIndex].setPIErevolveAnchor(originP, angleVector[lIndex]);
			objectVector[lIndex].setPIEinvisible();
			pieHandle.addDisplayChild(objectVector[lIndex].shape);
				
				pOrbit[lIndex] = new PIEcircle(pieHandle, 0, 0, radiusVector[lIndex], colorVector[lIndex]);
				pOrbit[lIndex].setPIEfill(false);
				pOrbit[lIndex].setPIEborder(true);
				pieHandle.addDisplayChild(pOrbit[lIndex].shape);
			
			checks[lIndex] = new PIEcheckBox(pieHandle, nameVector[lIndex]);
			checks[lIndex].x = 40;
			checks[lIndex].y = 200+lIndex*30;
			checks[lIndex].setVisible();
			pieHandle.addUIpanelChild(checks[lIndex].container);
			lIndex++;
		}
		checks[1].addClickListener(handler1);
		checks[2].addClickListener(handler2);
		checks[3].addClickListener(handler3);
		checks[4].addClickListener(handler4);
	}
	
	function handler1() {
		if(checks[1].getPIEcheckBoxStatus()==true) {
			objectVector[1].setPIEinvisible();
			checks[1].setPIEcheckBoxStatus(false);
			
		}	
		else {
			objectVector[1].setPIEvisible();
			checks[1].setPIEcheckBoxStatus(true);
			
		}
	}
	function handler2() {
		if(checks[2].getPIEcheckBoxStatus()==true) {
			objectVector[2].setPIEinvisible();
			checks[2].setPIEcheckBoxStatus(false);
		}
		else {
			objectVector[2].setPIEvisible();
			checks[2].setPIEcheckBoxStatus(true);
		}
	}
	function handler3() {
		if(checks[3].getPIEcheckBoxStatus()==true) {
			objectVector[3].setPIEinvisible(); 
			checks[3].setPIEcheckBoxStatus(false);
		}
		else {
			objectVector[3].setPIEvisible();
			checks[3].setPIEcheckBoxStatus(true);
		}
	}
	function handler4() {
		if(checks[4].getPIEcheckBoxStatus()==true) { 
			objectVector[4].setPIEinvisible();
			checks[4].setPIEcheckBoxStatus(false);
		} 
		else {
			objectVector[4].setPIEvisible();
			checks[4].setPIEcheckBoxStatus(true);
		}
	}
	
	createjs.Ticker.addEventListener("tick",nextFrame);
	
	/**
	 *
	 * This function is called by the PIE framework after every system Timer Iterrupt
	 *
	 */
	function nextFrame()
	{
		var lIndex;

		/* Create elements and set rotation values */
		lIndex = 1;
		while (lIndex < this.PIEobjects)
		{
			
			if (objectVector[lIndex].isPIEvisible())
			{
				angleVector[lIndex] = angleVector[lIndex] + 0.05;
				objectVector[lIndex].revolvePIEelement(angleVector[lIndex]);
			}
			/* Increment for loop */
			lIndex++;
			pieHandle.stage.update();
		}
		
	}
	


	
	window.Experiment = Experiment;

}())
