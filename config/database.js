var local = {
    'host':'localhost',
    'user':'root',
    'password':'123a456',
    'port':'3306',
    'database':'hangman_test'
}

var public = {
    'host':'localhost',
    'user':'root',
    'password':'123a456',
    'port':'3306',
    'database':'hangman'
}

module.exports = (process.argv[2] =='public' || process.argv[3] =='public') ? public : local;