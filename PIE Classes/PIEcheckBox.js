(function() {

	function PIEcheckBox(parentPie, cLabel) {
		this.initialize(parentPie, cLabel);
	}
	
	var p = PIEcheckBox.prototype;
	
	p.pie;
	p.x;
	p.y;
	p.check;
	p.container;
	p.text;
	p.width;
	p.height;
	p.selected;
	
	p.initialize = function(parentPie, cLabel) {
		this.text = new createjs.Text(cLabel, "12px Arial", "black");
		this.check = new createjs.Shape();
		this.container = new createjs.Container();
		this.width = 10;
		this.height = 10;
		this.selected = false;
	}
	
	p.setVisible = function() {
		this.createCheck();
	}
	
	p.createCheck = function() {
		/* draw check box */
		this.check.graphics.beginStroke("black");
		this.check.graphics.beginFill("white");
		this.check.graphics.drawRoundRect(this.x, this.y, this.width, this.height,2);
		this.container.addChild(this.check);
		this.text.x = this.x + 20;
		this.text.y = this.y;
		this.container.addChild(this.text);
	}
	
	p.setPIEcheckBoxStatus=function(cStatus)
	{
		this.selected = cStatus;
		if(cStatus == true) {
			/* color the check */
			this.check.graphics._fillInstructions[0].params[1] = "black";
		} else {
			this.check.graphics._fillInstructions[0].params[1] = "white";
		}
	}

	p.getPIEcheckBoxStatus=function()
	{
		return(this.selected);
	}

	p.addClickListener=function(clickListener)
	{
		this.container.on("click", clickListener);
	}

	window.PIEcheckBox = PIEcheckBox;

}())
