{

    var title = document.getElementById('title');
    if(title){
        title.innerHTML = MESSAGE.TITLE;
    }
    
    var desc = document.getElementById('game_explain');
    if(desc){
        desc.innerHTML = MESSAGE.GAME_EXPLAIN;
    }
    
    var hello = document.getElementById('hello');
    if(hello){
        hello.innerHTML = 'Hello, ' + hello.dataset.displayname;
    }

    var start = document.getElementById('start');
    if(start){
        let button = document.createElement('button');
        button.addEventListener('click', ()=>{
            window.location = '/home/game';
        });
        button.innerHTML = "START";
        start.appendChild(button);
    }
}