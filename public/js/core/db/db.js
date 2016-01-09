/**
 * Created by Masoud on 1/4/2016.
 */


var path = require('path');
var dir = global.APP_DIR;
//console.debug(dir);
//var SQLite = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);

//SQLite.executeSql('CREATE TABLE IF NOT EXISTS mailBox (id primary auto-increment, subject, text, date, fromMail, fromName, folder)');

var ProcessorDB = new global.NEDB({ filename: path.join(dir, 'Sepehr-Processors.db') , autoload: true});

//exports.SQlite = SQLite;