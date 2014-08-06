(function() {

	function PIEbutton(parentPie, bLabel) {
		this.initialize(parentPie, bLabel);	
	}
        
        var p = PIEbutton.prototype;
        
        p.pie;
        p.label;
        p.width;
        p.height;
        p.background;
        p.x;
        p.y;
        p.container;
        p.shape;
        
        p.initialize = function(parentPie, bLabel) {
            this.pie = parentPie;
            this.label = new createjs.Text(bLabel,"12px Arial","black");
            this.width = this.label.getMeasuredWidth()+5;
            this.height = this.label.getMeasuredHeight()+10;
            this.background = "#c0c4c2";
            this.container = new createjs.Container();
        }
        
        p.setVisible=function() {
			this.createButton();
		}
        
        p.createButton=function() {
            this.shape = new createjs.Shape();
            this.shape.graphics.beginStroke(this.background).beginFill(this.background);
            this.shape.graphics.drawRoundRect(this.x, this.y, this.width, this.height, 5);
            var b = this.label.getBounds();
			//this.label.x = this.width - b.width; 
			//this.label.y = this.height - b.height;
            this.container.addChild(this.shape);
            this.container.addChild(this.label);
             
        } 
        
        p.addClickListener=function(clickListener)
        {
            PIEclickListener = clickListener;
            this.container.on("click", clickListener);
        }        
        

	window.PIEbutton = PIEbutton;

}())
