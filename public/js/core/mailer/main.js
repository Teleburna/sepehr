/**
 * Created by Masoud on 1/4/2016.
 */
var db = require('../db/db');
var events = require('events');
var eventEmitter = new events.EventEmitter();

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
    attachments: true,
    attachmentOptions: { stream: "true" }
});
var start = function() {
    if (localStorage.hasListener == "true") {
        console.log("Start listening to " + localStorage.listenerName);
        mailListener.start();
    }
};

mailListener.on("server:connected", function(){
    console.log("imapConnected");
    eventEmitter.emit("server:connected");
});

mailListener.on("server:disconnected", function(){
    console.log("imapDisconnected");

    eventEmitter.emit("server:disconnected");
});

mailListener.on("error", function(err){
    console.log(err);

    eventEmitter.emit("error");
});

mailListener.on("mail", function(mail){
    //console.log(mail);
    delete mail.headers;
    delete mail.cc;
    delete mail.bcc;
    delete mail.inReplyTo;
    delete mail.priority;
    delete mail.references;
    mail.folder = "INBOX";
    console.log("new Mail Recieved");
    db.MailDB.insert(mail,function(err,data){
        if(err){
            console.log(err);
        }
        else{

            eventEmitter.emit("mail",data);
            console.log("Mail Added");
            //factory.inBox.push(data);
            //handler(mail,resultCallBack);
        }

    });
});

mailListener.on("attachment", function(attachment){
    console.log(attachment);
    var output = fs.createWriteStream(global.ATTACHMENT_DIR+"\\"+attachment.fileName);
    attachment.stream.pipe(output);

    eventEmitter.emit("attachment");
});

exports.on = eventEmitter.on;
exports.start = start;