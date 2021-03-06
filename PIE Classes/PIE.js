(function() {

	function PIE() {
		this.initListener();
	}

	var p =PIE.prototype;
	

	p.experiment;
    p.stage;

	p.experimentTitle;
	p.experimentDisplay;
	p.experimentUIpanel;

	p.TitleRectangle;
	p.DisplayRectangle;
	p.UIpanelRectangle;
	p.UIpanelRoundedRectangle;
	p.PauseControl;
	p.ResetControl;
	p.speedLabel;

	p.titleBorderWidth;
	p.titleBottomX;
	p.titleBottomY;
	p.UIpanelWidth;
	p.storedWidth;
	p.storedHeight;

	p.UIpanelSliders;
	p.UIpanelSliderTopY;
	p.UIpanelSliderWidth;
	p.UIpanelSliderHeight;
	p.UIpanelCheckBoxes;
	p.UIpanelCheckBoxTopY;
	p.UIpanelCheckBoxWidth;
	p.UIpanelCheckBoxHeight;
	p.UIpanelRadioButtons;
	p.UIpanelRadioButtonTopY;
	p.UIpanelRadioButtonWidth;
	p.UIpanelRadioButtonHeight;
	p.UIpanelLabelledInputs;
	p.UIpanelLabelledInputTopY;
	p.UIpanelLabelledInputWidth;
	p.UIpanelLabelledInputHeight;

	p.mainStage;
	p.stageW;
	p.stageH;

	p.AtoDtranslateX;
	p.AtoDtranslateY;
	p.AtoDscaleX;
	p.AtoDscaleY;

	p.DtoAtranslateX;
	p.DtoAtranslateY;
	p.DtoAscaleX;
	p.DtoAscaleY;

	/* Drag Variables */
	p.dragObject;
	p.dragClickX;
	p.dragClickY;

	/* Timer Variables */
	p.PIEtimer;
	p.PIEspeedScale;
	p.PIEinterval;
	p.PIErepeatCount;
	p.PIEtime;
	p.PIEtimerForever;
	p.parameters;

	/* Developer's Name */
	p.developerLabel


	p.loadParameters=function(){
	    parameters = new Object();
	    parameters = LoaderInfo(this.root.loaderInfo).parameters;
	}


	p.initListener=function()
	{
		this.initialisePanels();
	    /*this.addEventListener( Event.ADDED , this.addedHandler );                        
	    this.addEventListener( Event.ADDED_TO_STAGE , this.addedToStageHandler );
	    this.addEventListener( FlexEvent.CREATION_COMPLETE , this.creationCompleteHandler );  */
	}

	/**
	 * This function returns parameter value based on parameter key.
	 * This function searches the list of parameter passed from html file and return the value if found in the list otherwise returns null.
	 * @param    key
	 * @return String This function returns parameter value based on parameter key.
	 */
	p.getParameter=function(key) {
	    var value = "";
		if (key != null && key.length > 0) {
		    if (parameters == null) {
				loadParameters();
			}
			for (var element in parameters) {
				if (element == key){
					value =   String(parameters[key]);
				}
			}	
		}
	    return value;
	}
	 
	p.addedHandler=function(event)
	{
	    if (this.stage != null)
	    {
	        removeListeners();
	        initialisePanels();
	    }
	}

	p.addedToStageHandler=function( event )
	{
	    if (this.stage != null)
	    {
	        removeListeners();
	        initialisePanels();
	    }
	}

	p.creationCompleteHandler=function(event)
	{
	    if (this.stage != null)
	    {
	        removeListeners();
	        initialisePanels();
	    }
	}
	 
	p.removeListeners=function()
	{
	    this.removeEventListener( Event.ADDED , addedHandler );                        
	    this.removeEventListener( Event.ADDED_TO_STAGE , addedToStageHandler );
	    this.removeEventListener( FlexEvent.CREATION_COMPLETE , creationCompleteHandler );                        
	}

	p.initialisePanels=function()
	{
	    /* Initialise Transformation Variables */
	    this.AtoDtranslateX = 0.0;
	    this.AtoDtranslateY = 0.0;
	    this.AtoDscaleX     = 1.0;
	    this.AtoDscaleY     = 1.0;
	    this.DtoAtranslateX = 0.0;
	    this.DtoAtranslateY = 0.0;
	    this.DtoAscaleX     = 1.0;
	    this.DtoAscaleY     = 1.0;
	    
	    this.experimentDisplay = new createjs.Container();
	    this.experimentUIpanel = new createjs.Container();

	    /* Get Stage Variables */
	    this.stage = new createjs.Stage("myCanvas");
	    this.stageW  = this.stage.canvas.width;
	    this.stageH  = this.stage.canvas.height;

	    this.createExperimentTitle();
	    this.createExperimentDisplay();
	    this.createExperimentUIpanel();

	    /* Initiate a timer */
	    //this.PIEinitiateTimer();
  
		this.experiment = new Experiment(this);
	}

	p.addTitleChild=function(dElement)
	{
		this.stage.addChild(dElement);
	}

	p.addDisplayChild=function(dElement)
	{
		this.experimentDisplay.addChild(dElement);
		this.stage.update();
	}

	p.addUIpanelChild=function(dElement)
	{
	    this.experimentUIpanel.addChild(dElement);
	    this.stage.update();
	}

	p.createExperimentTitle=function()
	{
	    this.titleBorderWidth = 30;
		this.experimentDisplay.x = this.titleBorderWidth;
		this.experimentDisplay.y = this.titleBorderWidth;
		this.experimentDisplay.width = this.stageW - 2*this.titleBorderWidth;
		this.experimentDisplay.height = this.stageH - 2*this.titleBorderWidth; 
	    this.titleBottomX = this.titleBorderWidth * 1.25;
	    this.titleBottomY = this.stageH - this.titleBorderWidth * 0.75;
	    this.TitleRectangle = new PIEroundedRectangle(this, 0, 0, this.stageW, this.stageH, "#990033");
	    this.TitleRectangle.disablePIEtransform();
	    this.stage.addChild(this.TitleRectangle.shape);
	    this.stage.addChild(this.experimentDisplay);
	    this.stage.addChild(this.experimentUIpanel);
	    this.experimentUIpanel.x = this.titleBorderWidth;
	    this.stage.update();
	}

	p.showExperimentName=function(eName)
	{
		var titleLabel;

	    /* Create Title */
	    titleLabel = new createjs.Text(eName, "20px Arial",  "#FFFF88");
	    
	    /* Position the Title */
	    titleLabel.x = this.stageW/2 - titleLabel.getMeasuredWidth()/2;
	    titleLabel.y = 5;

	    this.stage.addChild(titleLabel);
	    this.stage.update();
	}


	p.showDeveloperName=function(dName)
	{
	    /* Create Title */
	    this.dName = "Developer: " + dName;
	    this.developerLabel = new createjs.Text(this.dName, "10px Arial", "white");
	 //   this.developerLabel.setLabelUnderline(true);
	 //   this.developerLabel.setLabelItalic(true);
	  //  this.developerLabel.setLabelBold(false);
	    this.developerLabel.text = this.dName;
	 	
	    /* Position the Title */
	    this.developerLabel.x = this.titleBorderWidth + 5;
	    this.developerLabel.y = 5;
	    this.stage.addChild(this.developerLabel);
	    this.stage.update();
	    this.showEkShiksha();
	}

	/* this.TitleRectangle.getFillColor() */

	p.showEkShiksha=function()
	{
		var ekShikshaLabel;

	    /* Create Title */
	    var author = "ekShiksha";
	    ekShikshaLabel =new createjs.Text(author, "14px Arial", "white");
	   // ekShikshaLabel.setLabelUnderline(true);
	   // ekShikshaLabel.setLabelItalic(true);
	   // ekShikshaLabel.setLabelBold(true);
	   // ekShikshaLabel.text = author;
	 
	    /* Position the Title */
	    ekShikshaLabel.x = this.stageW-ekShikshaLabel.getMeasuredWidth()-10;
	    /* titleBottomY */
	    ekShikshaLabel.y = this.stageH-20;

	    this.stage.addChild(ekShikshaLabel);
	    this.stage.update();
	}


	p.PIEsetTitleColors=function(fColor, bColor)
	{
	    this.TitleRectangle.changeFillColor(fColor);
	}

	p.createExperimentDisplay=function()
	{          
	    this.DisplayRectangle = new PIEsprite();
	    this.DisplayRectangle = new PIErectangle(this, 0, 0, ( this.experimentDisplay.width ), this.experimentDisplay.height, "#0d0d0d");
	    this.DisplayRectangle.disablePIEtransform();
        this.addDisplayChild(this.DisplayRectangle.shape);
        this.stage.update();
	}

	p.PIEsetDisplayColors=function(fColor, bColor)
	{
	    this.DisplayRectangle.changeFillColor(fColor);
	    this.UIpanelRectangle.changeFillColor(fColor);
	    this.stage.update();
	    this.stage.update();
	}

	p.PIEtranslateStageToDisplayAndCall=function(stageX, stageY, handler)
	{
	var lX;
	var lY;

	    lX = (stageX - this.experimentDisplay.x);
	    if (lX < 0) lX = 0;
	    if (lX > this.experimentDisplay.width) lX = this.experimentDisplay.width;
	    lY = (stageY - this.experimentDisplay.y);
	    if (lY < 0) lY = 0;
	    if (lY > this.experimentDisplay.height) lY = this.experimentDisplay.height;
	    handler(lX, lY);
	}
	p.PIEdisplayGrabMe=function(mEvent)
	{
	    this.dragClickX = mEvent.stageX;
	    this.dragClickY = mEvent.stageY;
	    this.dragObject = PIEsprite(mEvent.currentTarget);

	    this.dragObject.removeEventListener(MouseEvent.MOUSE_DOWN, this.PIEdisplayGrabMe);
	    this.mainStage.addEventListener(MouseEvent.MOUSE_MOVE, this.PIEdisplayDragMe);
	    this.mainStage.addEventListener(MouseEvent.MOUSE_UP, this.PIEdisplayDropMe);

	    this.PIEtranslateStageToDisplayAndCall(mEvent.stageX, mEvent.stageY, this.dragObject.handleGrab);
	}

	p.PIEdisplayDragMe=function(mEvent)
	{
	    if (this.dragObject != null)
	    {
	        this.PIEtranslateStageToDisplayAndCall(mEvent.stageX, mEvent.stageY, this.dragObject.handleDrag);
	        mEvent.updateAfterEvent();
	    }
	}

	p.PIEdisplayDropMe=function(mEvent)
	{
	var diffX;          /* Difference in X pixels */
	var diffY;          /* Difference in Y pixels */

	    diffX = Math.abs(mEvent.stageX - this.dragClickX);
		diffY = Math.abs(mEvent.stageY - this.dragClickY);
	    if ( (diffX > 1) || (diffY > 1) )
	    {   /* Not Dropped at same point (not a click) */
	        this.dragClickX = 0;
	        this.dragClickY = 0;

	        this.mainStage.removeEventListener(MouseEvent.MOUSE_MOVE, this.PIEdisplayDragMe);
	        this.mainStage.removeEventListener(MouseEvent.MOUSE_UP, this.PIEdisplayDropMe);
	        this.dragObject.addEventListener(MouseEvent.MOUSE_DOWN, this.PIEdisplayGrabMe);

	        this.PIEtranslateStageToDisplayAndCall(mEvent.stageX, mEvent.stageY, this.dragObject.handleDrop);
	        mEvent.updateAfterEvent();

	        this.dragObject = null;
	    }
	}

	p.createExperimentUIpanel=function()
	{

	    this.UIpanelWidth = (this.stageW - 2 * this.titleBorderWidth - this.experimentDisplay.width);
	    this.UIpanelRectangle  = new createjs.Shape();
        
        
	    
	    /*UIpanelRoundedRectangle   = new PIEroundedRectangle(this, 2, 12, UIpanelWidth - 12, (stageH - 2 * titleBorderWidth) - 22, 0x008800);
	    UIpanelRoundedRectangle.changeBorder(4, 0x0000FF, 1.0);
	    UIpanelRoundedRectangle.changeBorderRadius(15);
	    UIpanelRoundedRectangle.disablePIEtransform();
	    experimentUIpanel.addChild(UIpanelRoundedRectangle);*/

	    /*UIpanelSliders      = 0;
	    UIpanelSliderTopY   = 12 + 0.02 * UIpanelRoundedRectangle.getPIErectangleH();
	    UIpanelSliderWidth  = 0.9  * UIpanelRoundedRectangle.getPIErectangleW();
	    UIpanelSliderHeight = 0.03 * UIpanelRoundedRectangle.getPIErectangleH();

	    UIpanelCheckBoxes     = 0;
	    UIpanelCheckBoxTopY   = UIpanelSliderTopY + 0.1 * UIpanelRoundedRectangle.getPIErectangleH();
	    UIpanelCheckBoxWidth  = 0.9 * UIpanelRoundedRectangle.getPIErectangleW();
	    UIpanelCheckBoxHeight = 0.05 * UIpanelRoundedRectangle.getPIErectangleH();

	    UIpanelRadioButtons      = 0;
	    UIpanelRadioButtonTopY   = UIpanelCheckBoxTopY + 0.15 * UIpanelRoundedRectangle.getPIErectangleH();
	    UIpanelRadioButtonWidth  = 0.9 * UIpanelRoundedRectangle.getPIErectangleW();
	    UIpanelRadioButtonHeight = 0.05 * UIpanelRoundedRectangle.getPIErectangleH();

	    UIpanelLabelledInputs      = 0;
	    UIpanelLabelledInputTopY   = UIpanelRadioButtonTopY + 0.15 * UIpanelRoundedRectangle.getPIErectangleH();
	    UIpanelLabelledInputWidth  = 0.9 * UIpanelRoundedRectangle.getPIErectangleW();
	    UIpanelLabelledInputHeight = 0.1 * UIpanelRoundedRectangle.getPIErectangleH();*/
	}

	p.PIEsetUIpanelColors=function(fColor, bColor)
	{
	    this.UIpanelRoundedRectangle.changeFillColor(fColor);
	}

	p.PIEsetUIpanelVisible=function()
	{
	    if (this.experimentUIpanel.visible == false)
	    {
	        this.experimentUIpanel.visible = true;
	        this.PIEfixDrawingArea(storedWidth, storedHeight, true);
	    }
	}
	p.PIEsetUIpanelInvisible=function()
	{
	    if (this.experimentUIpanel.visible == true)
	    {
	        this.experimentUIpanel.visible = false;
	        storedWidth  = DisplayRectangle.getPIErectangleW();
	        storedHeight = DisplayRectangle.getPIErectangleH();
	        this.PIEsetDrawingArea(1.0, 1.0);
	    }
	}

	p.addHSlider=function(hslider)
	{
	    hslider.x      = this.UIpanelRectangle.getPIErectangleW() * 0.05;
	    hslider.y      = this.UIpanelSliderTopY + (UIpanelSliders * (UIpanelSliderHeight + 10));
	    if ( (hslider.y + UIpanelSliderHeight + 10) > UIpanelCheckBoxTopY) UIpanelCheckBoxTopY = (hslider.y + UIpanelSliderHeight + 10);
	    hslider.width  = UIpanelSliderWidth;
	    hslider.height = UIpanelSliderHeight;
	    hslider.visible = true;
	    hslider.enabled = true;
	    UIpanelSliders = UIpanelSliders + 1;

	    this.addUIpanelChild(hslider);
	}

	p.addCheckBox=function(checkBox)
	{
	    checkBox.x         = this.UIpanelRectangle.getPIErectangleW() * 0.05;
	    checkBox.y         = this.UIpanelCheckBoxTopY + (UIpanelCheckBoxes * (UIpanelCheckBoxHeight));
	    if ( (checkBox.y + UIpanelCheckBoxHeight + 10) > UIpanelRadioButtonTopY) UIpanelRadioButtonTopY = (checkBox.y + UIpanelCheckBoxHeight + 10);
	    checkBox.width     = UIpanelCheckBoxWidth;
	    checkBox.height    = UIpanelCheckBoxHeight;
	    checkBox.visible   = true;
	    checkBox.enabled   = true;
	    UIpanelCheckBoxes  = UIpanelCheckBoxes + 1;

	    this.addUIpanelChild(checkBox);
	}

	p.addRadioButton=function(radioButton)
	{
	    radioButton.x      = this.UIpanelRectangle.getPIErectangleW() * 0.05;
	    radioButton.y      = this.UIpanelRadioButtonTopY + (UIpanelRadioButtons * (UIpanelRadioButtonHeight));
	    if ( (radioButton.y + UIpanelRadioButtonHeight + 10) > UIpanelLabelledInputTopY) UIpanelLabelledInputTopY = (radioButton.y + UIpanelRadioButtonHeight + 10);
	    radioButton.width  = UIpanelRadioButtonWidth;
	    radioButton.height = UIpanelRadioButtonHeight;
	    radioButton.visible = true;
	    radioButton.enabled = true;
	    UIpanelRadioButtons = UIpanelRadioButtons + 1;

	    this.addUIpanelChild(radioButton);
	}

	p.addLabelledInput=function(labelledInput)
	{
	    labelledInput.x      = this.UIpanelRectangle.getPIErectangleW() * 0.05;
	    labelledInput.y      = this.UIpanelLabelledInputTopY + (UIpanelLabelledInputs * (UIpanelLabelledInputHeight));
	    labelledInput.visible = true;
	    UIpanelLabelledInputs = UIpanelLabelledInputs + 1;

	    this.addUIpanelChild(labelledInput);
	}

	p.PIEcreateResetButton=function()
	{
	    this.ResetControl   = new PIEbutton(this, "Reset");
	    this.ResetControl.x = this.titleBottomX;
	    this.ResetControl.y = this.titleBottomY;
	    this.ResetControl.width = 100;
	    this.ResetControl.height = 15;
	    this.ResetControl.label.x = this.titleBottomX+30;
	    this.ResetControl.label.y = this.titleBottomY+2.5;
	    this.titleBottomX = this.titleBottomX + 110;
	    //ResetControl.visible = true;
	    this.stage.addChild(this.ResetControl.container);
	    this.ResetControl.setVisible();
	    this.stage.update();
	}

	p.PIEcreatePauseButton=function()
	{
	    this.PauseControl   = new PIEbutton(this, "Pause");
	    this.PauseControl.x = this.titleBottomX;
	    this.PauseControl.y = this.titleBottomY;
	    this.PauseControl.width = 100;
	    this.PauseControl.height = 15;
	    this.PauseControl.label.x = this.titleBottomX + 30;
	    this.PauseControl.label.y = this.titleBottomY + 2.5;
	    this.titleBottomX = this.titleBottomX + 110;
	    this.PauseControl.setVisible();
	    //this.PauseControl.container.on("click",this.PIEtoggleTimer);
	    this.stage.addChild(this.PauseControl.container);
	    
	}

	p.PIEcreateSpeedButtons=function()
	{
	var tempButton;

	    tempButton   = new PIEbutton(this, "-");
	    tempButton.x = titleBottomX;
	    tempButton.y = titleBottomY;
	    tempButton.width = 10;
	    tempButton.height = 15;
	    titleBottomX = titleBottomX + 15;
	    tempButton.visible = true;
	    tempButton.addClickListener(this.PIEdecreaseSpeed);
	    this.addTitleChild(tempButton);

	    speedLabel = new PIElabel(this, "1.00", 10, this.TitleRectangle.getFillColor(), 0xFFFF88);
	    speedLabel.x = titleBottomX;
	    speedLabel.y = titleBottomY;
	    speedLabel.height = 15;
	    titleBottomX = titleBottomX + speedLabel.width + 5;
	    speedLabel.visible = true;
	    this.addTitleChild(speedLabel);

	    tempButton   = new PIEbutton(this, "+");
	    tempButton.x = titleBottomX;
	    tempButton.y = titleBottomY;
	    tempButton.width = 10;
	    tempButton.height = 15;
	    titleBottomX = titleBottomX + 15;
	    tempButton.visible = true;
	    tempButton.addClickListener(this.PIEincreaseSpeed);
	    this.addTitleChild(tempButton);
	}

	p.PIEincreaseSpeed=function()
	{
	    if (PIEgetSpeedScale() < 2) PIEsetSpeedScale(PIEgetSpeedScale() + 0.25);
	    this.speedLabel.text = this.getSpeedText();
	}

	p.PIEdecreaseSpeed=function()
	{
	    if (PIEgetSpeedScale() > 0.25) PIEsetSpeedScale(PIEgetSpeedScale() - 0.25);
	    this.speedLabel.text = this.getSpeedText();
	}

	p.getSpeedText=function()
	{
	var sText;

	    sText = String(this.PIEgetSpeedScale());
	    sText = sText.substring(0, (sText.lastIndexOf(".") + 3));
	    return(sText);
	}

	/*******************************
	 *******************************
	 ******* Layout Section ********
	 *******************************
	 *******************************/
	p.PIEsetApplicationBoundaries=function(topLeftX, topLeftY, aWidth, aHeight)
	{
	    /* A to D transform variables */
	    this.AtoDtranslateX = (topLeftX);
	    this.AtoDtranslateY = (topLeftY);
	    this.AtoDscaleX     = this.DisplayRectangle.getPIErectangleW() / aWidth;
	    this.AtoDscaleY     = this.DisplayRectangle.getPIErectangleH() / aHeight;
	    /* D to A transform variables */
	    this.DtoAtranslateX = 0;
	    this.DtoAtranslateY = 0;
	    this.DtoAscaleX     = this.aWidth / this.DisplayRectangle.getPIErectangleW();
	    this.DtoAscaleY     = this.aHeight / this.DisplayRectangle.getPIErectangleH();
	}

	p.PIEapplicationToDisplay=function(applicationP)
	{
	    return(new createjs.Point(((applicationP.x - this.AtoDtranslateX) * this.AtoDscaleX) + this.DtoAtranslateX, ((applicationP.y - this.AtoDtranslateY) * this.AtoDscaleY) + this.DtoAtranslateY));
	}

	p.PIEapplicationToDisplayW=function(applicationW)
	{
	    return(applicationW * this.AtoDscaleX);
	}

	p.PIEapplicationToDisplayH=function(applicationH)
	{
	    return(applicationH * this.AtoDscaleY);
	}

	p.PIEdisplayToApplication=function(displayP)
	{
	    return(new Point( ( (displayP.x - this.DtoAtranslateX) * this.DtoAscaleX) + this.AtoDtranslateX, ( (displayP.y - this.DtoAtranslateY) * this.DtoAscaleY) + this.AtoDtranslateY));
	}

	p.PIEdisplayToApplicationW=function(displayW)
	{
	    return(displayW * this.DtoAscaleX);
	}

	p.PIEdisplayToApplicationH=function(displayH)
	{
	    return(displayH * this.DtoAscaleY);
	}

	p.PIEsetDrawingArea=function(displayW,displayH)
	{
	var localW;
	var localH;

	    localH = (this.stageH - 2 * this.titleBorderWidth);
	    if (displayW <= 0.9)
	    {
	    	localW = (this.stageW - 2 * this.titleBorderWidth) * displayW;
	        this.PIEfixDrawingArea(localW, localH, true);
	    }
	    else
	    {
	        localW = (this.stageW - 2 * this.titleBorderWidth);
	        this.PIEfixDrawingArea(localW, localH, false);
	    }
	}

	p.PIEfixDrawingArea=function(localW, localH, visibleFlag)
	{
	    this.experimentUIpanel.x = this.experimentDisplay.x + localW;
	    //this.UIpanelRectangle.changeSize( (this.stageW - (2 * this.titleBorderWidth) - localW), localH);
	    this.UIpanelRectangle = new createjs.Shape();
	    this.UIpanelRectangle.graphics.beginStroke("blue").beginFill("blue").drawRect(this.experimentUIpanel.x, this.titleBorderWidth, (this.stageW - (2 * this.titleBorderWidth) - localW), localH);
	    
	    this.addUIpanelChild(this.UIpanelRectangle);
	    this.DisplayRectangle.changeSize(localW, localH);
	    this.experimentDisplay.width = localW;
	    this.stage.update();
	}

	p.PIEgetAspectRatio=function()
	{
	    return(stageW / stageH);
	}

	p.PIEgetDrawingAspectRatio=function()
	{
	   // return(this.DisplayRectangle.getPIErectangleW() / this.DisplayRectangle.getPIErectangleH());
	}

	/*******************************
	 *******************************
	 ******* Timer  Section ********
	 *******************************
	 *******************************/
	p.PIEinitiateTimer=function()
	{
	    /* Create a default Timer with 20 ms duration and 5000 run count (100 seconds) */
	    PIEtimerForever = true;
	    PIEtime        = 0;
	    this.PIEsetSpeedScale(1.00);
	    PIEinterval    = 20;
	    PIErepeatCount = 5000;
	    PIEtimer       = new Timer(PIEinterval, PIErepeatCount);
	    PIEtimer.addEventListener(TimerEvent.TIMER, PIEhandleInterrupt);
	    PIEtimer.addEventListener(TimerEvent.TIMER_COMPLETE, PIEhandleTimerReset);
	}

	p.PIEsetTimerForever=function(forever)
	{
	    PIEtimerForever = forever;
	}

	p.PIEgetTime=function()
	{
	    return(PIEtime);
	}
	p.PIEsetTime=function(newTime)
	{
	    PIEtime = newTime;
	}

	p.PIEresetTimer=function()
	{
	    PIEsetSpeedScale(1.00);
	    PIEtimer.reset();
	}

	p.isPIEtimerRunning=function()
	{
	    return(PIEtimer.running);
	}

	p.PIEtoggleTimer=function()
	{
		
	}

	p.PIEpauseTimer=function()
	{
	    if (PIEtimer.running) PIEtimer.stop();
	}

	p.PIEresumeTimer=function()
	{
	    if (PIEtimer.running == false) PIEtimer.start();
	}

	p.PIEgetDelay=function()
	{
	    return(PIEinterval * PIEspeedScale);
	}
	p.PIEsetDelay=function(tDelay)
	{
	    PIEinterval = tDelay;
	    PIEtimer.delay = PIEinterval;
	}

	p.PIEgetCurrentCount=function()
	{
	    return(PIEtimer.currentCount);
	}

	p.PIEgetRepetitions=function()
	{
	    return(PIErepeatCount);
	}
	p.PIEsetRepetitions=function(rCount)
	{
	    this.PIErepeatCount = rCount;
	    this.PIEtimer.repeatCount = rCount;
	}

	p.PIEgetSpeedScale=function()
	{
	    return(PIEspeedScale);
	}
	p.PIEsetSpeedScale=function(sScale)
	{
	    this.PIEspeedScale = sScale;
	}

	p.PIEgetTriggersLeft=function()
	{
	    return(PIErepeatCount - PIEtimer.currentCount);
	}

	p.PIEgetTimeLeft=function()
	{
	    return( (PIErepeatCount - PIEtimer.currentCount) * PIEinterval);
	}

	p.PIEhandleInterrupt=function(tEvent)
	{
	    PIEtime = PIEtime + PIEinterval * PIEspeedScale;
	    experiment.nextFrame();
	}

	p.PIEhandleTimerReset=function(tEvent)
	{
	    if (PIEtimerForever) { PIEtimer.reset(); PIEtimer.start(); }
	}


	window.PIE = PIE;
}())
