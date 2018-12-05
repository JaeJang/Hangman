{

    var title = document.getElementById('title');
    if(title){
        title.innerHTML = MESSAGE.TITLE;
        title.style.fontSize = "80px";
    }
    
    var desc = document.getElementById('game_explain');
    if(desc){
        desc.innerHTML = MESSAGE.GAME_EXPLAIN;
        desc.style.fontSize = "13px"
    }
    
    var hello = document.getElementById('hello');
    if(hello){
        hello.innerHTML = 'Welcome back, ' + hello.dataset.displayname;
    }

    var start = document.getElementById('start');
    if(start){
        let button = document.createElement('button');
        button.addEventListener('click', ()=>{
            window.location = '/home/game';
        });
        button.innerHTML = "BEGIN GAME";
        button.className = "btn btn-primary"
        button.style.width = "400px"
        button.style.height = "70px"
        button.style.fontSize = "30px"
        start.appendChild(button);
    }
}