/**
 * Created by Masoud on 1/4/2016.
 */
//var db = require('../db/db');
var events = require('events');
var fs = require('fs');
mailEvent = new events.EventEmitter();

var MailListener = require("mail-listener2");
var mailListener = new MailListener({
    username: localStorage.email,
    password: localStorage.password,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX",
    markSeen: true,
    fetchUnreadOnStart: true,
    attachments: false,
    //attachmentOptions: { stream: "true" },
    mailParserOptions: {streamAttachments: false}
});
startMailListener  = function() {
    if (localStorage.hasListener == "true") {
        console.debug("Start listening to " + localStorage.listenerName);
        mailListener.start();
    }
};

mailListener.on("server:connected", function(){
    console.debug("imapConnected");
    mailEvent.emit("server:connected");
});

mailListener.on("server:disconnected", function(){
    console.debug("imapDisconnected");

    mailEvent.emit("server:disconnected");
});

mailListener.on("error", function(err){
    console.debug(err);

    //mailEvent.emit("error");
});

mailListener.on("mail", function(mail){
    //console.debug(mail);
    delete mail.headers;
    delete mail.cc;
    delete mail.bcc;
    delete mail.inReplyTo;
    delete mail.priority;
    delete mail.references;
    mail.folder = "INBOX";


    SQLite.selectMail("messageId = '"+mail.messageId+"'", null, function(data){
       if(data.length != 0){
           console.log("Duplicated Mail Received!");

       }
        else{

           SQLite.insertMail(mail, function(data) {

               if(!data.err) {
                   mail.getDate = getDate;
                   mail.id = data.results.insertId;
                   var path = global.ATTACHMENT_DIR+"\\"+mail.messageId;
                   fs.mkdirSync(path);
                   path += "\\in"
                   fs.mkdirSync(path);

                   fs.writeFile(path+"/head.txt", mail.from[0].address, function(err) {
                       if(err) {
                           return console.log(err);
                       }
                       fs.writeFile(path+"/subject.txt", mail.subject, function(err) {
                           if(err) {
                               return console.log(err);
                           }
                           fs.writeFile(path+"/body.txt", mail.text, function(err) {
                               if(err) {
                                   return console.log(err);
                               }
                               if(mail.attachments){
                                   for(var i = 0 ; i< mail.attachments.length ; i++){
                                       saveAttachment(mail.messageId, mail.attachments[i],function(err){
                                           if(!err){

                                               mailEvent.emit("mail", mail);
                                               console.log("Mail Added");
                                           }
                                       });
                                   }

                               }
                           });
                       });
                   });


               }
           });
           console.log("New Mail Received");
       }
    });



});

mailListener.on("attachment", function(attachment){
    console.log(attachment);


    mailEvent.emit("attachment");
});
saveAttachment = function(messageId, attachment, cb){
    var path = global.ATTACHMENT_DIR+"\\"+messageId+"\\in";
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
    /*var output = fs.createWriteStream(path+"\\"+attachment.generatedFileName);
    attachment.stream.pipe(output).close();
*/

    fs.writeFile(path+"\\"+attachment.generatedFileName, attachment.content, function(err) {
        // callback
        cb(err);
    });
};