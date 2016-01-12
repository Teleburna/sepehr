/**
 * Created by Masoud on 1/4/2016.
 */


//var path = require('path');
//var dir = global.APP_DIR;
//console.debug(dir);
    var INSERT_MAIL_ITEMS = 'INSERT INTO mailBox (messageId, fromName, fromAddress, replyToName, replyToAddress, toName, toAddress, attachmentsCount' +
    ', subject, text, html, date, folder) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
var SQLite = openDatabase('SepehrDB', '1.0', 'my first database', 2 * 1024 * 1024,function(result,t){
    console.debug(result,t);
});
SQLite.transaction(function(tx){

  /*  tx.executeSql('DROP TABLE IF NOT EXISTS mailBox (id INTEGER PRIMARY KEY ASC, messageId, fromName, fromAddress, replyToName, replyToAddress, toName, toAddress, attachmentsCount' +
    ', subject, text, html, date, folder)',[],function(result,t){
        console.debug(result,t);
    },function(result,t){
        console.debug(result,t);
    });
*/

    tx.executeSql('CREATE TABLE IF NOT EXISTS mailBox (id INTEGER PRIMARY KEY ASC, messageId, fromName, fromAddress, replyToName, replyToAddress, toName, toAddress, attachmentsCount' +
    ', subject, text, html, date, folder)',[],function(result,t){
        console.debug(result,t);
    },function(result,t){
        console.debug(result,t);
    });

});

SQLite.selectMail = function(where, limit, callBack) {

    var query = 'SELECT * FROM mailBox ';
    if(where && where != "")
    {
        query += 'WHERE '+where;
    }
    if(limit && limit != "")
    {
        query += ' LIMIT '+limit;
    }
        SQLite.transaction(function (tx) {
        tx.executeSql( query, [], function (tx, results) {
            callBack(sqlToArray(results.rows));
        }, function (tx, error) {
            console.error(error);
        });
    });
};

SQLite.insertMail = function(mail, callBack){
    var out = {};
    out.error = null;
    out.results = null;
    SQLite.transaction(function(tx) {
        //tx.executeSql('INSERT INTO mailBox (folder, subject, text, date, fromName) VALUES (?,?,?,?,?)', [mail.folder, mail.subject, mail.text, mail.date, mail.from[0].name], function (tx, results) {
        tx.executeSql(INSERT_MAIL_ITEMS, mailObjectToSqlArray(mail), function (tx, results) {
            //console.debug("Mail Added");
            console.debug(results);
            out.results = results;
            callBack(out);
        }, function (tx, err) {
            console.debug( err);
            out.error = err;
            callBack(out);
        });
    });
};

mailObjectToSqlArray = function(mail){


    var mailSqlArray = [];
    mailSqlArray.push(mail.messageId);
    mailSqlArray.push(mail.from[0].name);
    mailSqlArray.push(mail.from[0].address);
    var replyTo = [];
    replyTo.push({name:"",address:""});
    mail.replyTo = mail.replyTo || replyTo;
    mailSqlArray.push(mail.replyTo[0].name);
    mailSqlArray.push(mail.replyTo[0].address);
    mailSqlArray.push(mail.to[0].name);
    mailSqlArray.push(mail.to[0].address);
    mailSqlArray.push(mail.attachments ? mail.attachments.length : 0);
    mailSqlArray.push(mail.subject);
    mailSqlArray.push(mail.text);
    mailSqlArray.push(mail.html || "");
    mailSqlArray.push(mail.date);
    mailSqlArray.push(mail.folder);

   /* mail.fromName = mail.from[0].name;
    mail.fromAddress = mail.from[0].address;
    mail.replyToName = mail.replyTo[0].name;
    mail.replyToAddress = mail.replyTo[0].address;
    mail.toName = mail.to[0].name;
    mail.toAddress = mail.to[0].address;
    mail.attachmentsCount = mail.attachments ? mail.attachments.length : 0;
*/
    return mailSqlArray;

} ;

sqlToArray = function(rows){
    var len = rows.length,i;
    var mailArray = []
    for (i = 0; i < len; i++) {
        var m = rows.item(i);
        m.getDate = getDate;
        mailArray.push(m);
    }
    return mailArray;
};

getDate = function (date){
    var dateObj = new Date(date);
    return (dateObj.getMonth()+1)+"/"+dateObj.getDate();
};