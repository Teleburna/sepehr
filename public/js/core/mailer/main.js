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
    markSeen: false,
    fetchUnreadOnStart: true,
    attachments: true,
    attachmentOptions: { stream: "true" }
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
                   mailEvent.emit("mail", mail);
                   console.log("Mail Added");
               }
           });
           console.log("New Mail Received");
       }
    });



});

mailListener.on("attachment", function(attachment){
    console.log(attachment);
    var output = fs.createWriteStream(global.ATTACHMENT_DIR+"\\"+attachment.generatedFileName);
    attachment.stream.pipe(output);

    mailEvent.emit("attachment");
});
