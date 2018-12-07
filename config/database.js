var local = {
    'host':'localhost',
    'user':'root',
    'password':'123a456',
//  'password':'',
    'port':'3306',
    'database':'hangman'
}

var public = {
    'host':'localhost',
    'user':'root',
    'password':'123a456',
  //'password':'',
    'port':'3306',
    'database':'hangman_public'
}

module.exports = (process.argv[2] =='public' || process.argv[3] =='public') ? public : local;