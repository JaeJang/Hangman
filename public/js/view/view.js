 /*window.onload = function()
 {
	 var view = new View();
 }*/
 
 var View = function(controller)
 {
	this.controller = controller;
	//list of alphabet buttons
	this.buttons = [];
	//parent div for buttons
	this.buttonGroup = null;
	
	this.init();
 }
 
 //Initialize Buttons.
 View.prototype.init = function()
 {
	this.buttonGroup = document.querySelector('#button_group');
	//document.getElementById('you_have_sec').innerHTML = "You have " + TIME_LIMIT + " second to guess words.";
	this.initButtons();
 }
 
 //Create buttons and add them in html.
 View.prototype.initButtons = function()
 {
	for(var i = 0; i < 26; i++)
	{
		let tmpB = document.createElement('button');
		let alph = (i + 10).toString(36);
		tmpB.className = BUTTON_STYLE_ENABLE;
		tmpB.innerHTML = alph;
		tmpB.id = alph;
		tmpB.addEventListener('click', function(){ this.eventListener(event);}.bind(this));
		this.buttonGroup.appendChild(tmpB);
		this.buttons[i] = tmpB;
	}
	/* document.querySelector('#start').addEventListener('click', ()=>{
		let name = document.querySelector('#name').value;
		
		if(name === ""){
			document.querySelector('#user_name_err').innerHTML = "Enter username please"
			return;
		}
		
		this.controller.start(name);
	});

	document.querySelector('#restart').addEventListener('click',()=>{
		location.reload();
	}); */
 }

 View.prototype.resetButtons = function()
 {
	for(let i = 0; i < this.buttons.length; ++i)
	{
		this.buttons[i].className = BUTTON_STYLE_ENABLE;
		this.buttons[i].disabled = false;
	}
 }
 	
 //Event listener for buttons.
 //It calls a function in controller which is clicked.
 View.prototype.eventListener = function(event)
 {
	 this.controller.clicked(event.target.id);
 }
 
 //Initialize the definition of the word.
 View.prototype.updateDef = function(def)
 {
	document.querySelector('#def').innerHTML  = def;
 }
 
 //Update the word status and disable a button when user correct.
 View.prototype.updateWord = function(word, alpha)
 {
	document.querySelector('#target_word').innerHTML = word;
	
	for(let i = 0; i < this.buttons.length; ++i)
	{
		if(this.buttons[i].id ===alpha){
			
			this.buttons[i].className = BUTTON_STYLE_DISABLE_SUCESS;
			this.buttons[i].disabled = true;
		}
	}
 }
 
 //When user success to guess or fail to guessing
 //Ask user for another game
 //If not, close the window.
 View.prototype.end = function(message)
 {
	 setTimeout(function(){
		let con = confirm(message + '\nOne more round?');
		if(con == true)
			location.reload();
		else
		{
			window.alert("Thank you for playing");
			window.close();
		}
		 
	 },100);
 }
 
 //Update score and life.
 View.prototype.updatelife_score = function(life,score, alpha)
 {
	document.querySelector('#life').innerHTML = life + ' / 7';
	document.querySelector('#score').innerHTML = 'Score: ' + score;
	if(alpha !== null)
	{
		for(let i = 0; i < this.buttons.length; ++i)
		{
			if(this.buttons[i].id ===alpha){
				
				this.buttons[i].className = BUTTON_STYLE_DISABLE_FAIL;
				this.buttons[i].disabled = true;
			}
		}
	}

}

//Update time
View.prototype.updateTime = function(time)
{
	document.querySelector('#timer').innerHTML = time;
}

//Print ranks based on passed ranks json that has been retrieved from database
View.prototype.printRank = function(ranks)
{
	let ranking_table_div = document.getElementById('ranking_table_div');
	let table_body = document.getElementById('table_body');
	for (let i = 1; i < Object.keys(ranks).length; ++i)
	{
		let u = ranks[i];
		let tr = document.createElement('tr');
		let th = document.createElement('th');
		th.scope = "row";
		th.innerHTML = u[0];
		let td_name = document.createElement('td');
		let td_score = document.createElement('td');
		td_name.innerHTML = u[1];
		td_score.innerHTML = u[2];

		tr.appendChild(th);
		tr.appendChild(td_name);
		tr.appendChild(td_score);

		table_body.appendChild(tr);

		if(parseInt(u[3]) == ranks[0]){
			tr.style.fontWeight = 'bold';
			tr.style.color = 'red';
		}

	}

	ranking_table_div.style.display='block';
}

View.prototype.disableElement = function(e)
{
	document.querySelector(e).style.display = 'none';
}
View.prototype.enableElement = function(e)
{
	document.querySelector(e).style.display = 'block';
}