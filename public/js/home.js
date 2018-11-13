{

    var title = document.getElementById('title');
    if(title){
        title.innerHTML = MESSAGE.TITLE;
        title.className = 'text-center'
    }
    
    var desc = document.getElementById('game_explain');
    if(desc){
        desc.innerHTML = MESSAGE.GAME_EXPLAIN;
        desc.className = 'text-center'
    }
    
    var hello = document.getElementById('hello');
    if(hello){
        hello.innerHTML = 'Hello, ' + hello.dataset.displayname;
        hello.className = 'text-center';
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