const md5 = require('md5');

var hash = md5(Date.now())

console.log(hash);