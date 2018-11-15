/* module.exports ={
    'PORT':3002,
    'TOKEN':"This is a token that will be given"
} */

exports.PORT =  Number.isInteger(parseInt(process.argv[2])) ? parseInt(process.argv[2]) : 4500;
exports.IP = (process.argv[2] =='public' || process.argv[3] =='public') ?'3.16.168.124' : '127.0.0.1';