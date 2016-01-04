/**
 * Created by Masoud on 1/4/2016.
 */


var path = require('path');
var dir = global.APP_DIR;
console.log(dir);
var MailBox = new global.NEDB({ filename: path.join(dir, 'Sepehr-MailBox.db') , autoload: true});

exports.MailDB = MailBox;