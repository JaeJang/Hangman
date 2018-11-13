//When the window is loaded, controller is initialized,
window.onload = function(){
	var controller = new Controller();
}

var Controller = function(){
	this.view = null;
	this.model = null;
	this.init();
}

//Initialize View and Model.
Controller.prototype.init = function()
{
	this.view = new View(this);
	this.model = new Model(this.view);
}

//Check if a guess from user is correct.
Controller.prototype.clicked = function(alpha)
{
	this.model.check(alpha);
}

Controller.prototype.reset = function()
{
	this.model.reset();
}

Controller.prototype.start = function(name)
{
	this.model.start(name);
}