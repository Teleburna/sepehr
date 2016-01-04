/**
 * Created by Masoud on 18/08/2014.
 */
var MailListener = require("mail-listener2"),Imap = require('imap');
var MailParser = require("mailparser").MailParser;
var mailparser = {};
var mailListener = new MailListener({
    username: "mr.maj73@gmail.com",
    password: "X3m1824731",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX",
    markSeen: true,
    fetchUnreadOnStart: true,
    attachments: true,
    attachmentOptions: { directory: "attachments/" }
});
mailListener.start();
mailListener.on("server:connected", function(){
    var imap = mailListener.imap;
    console.log("imapConnected");
    imap.openBox('INBOX', true,function (err, box) {
        if (err) throw err;
        var f = imap.seq.fetch('62:*', {
            markSeen: true,
            bodies: ['', 'TEXT']
        });
        f.on('message', function (msg, seqno) {
            console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            var buffer = "";

            msg.on('body', function (stream, info) {
                stream.on('data', function (chunk) {
                    buffer += chunk.toString('utf8');
                });

                stream.once('end', function () {
                    if (info.which === 'TEXT') {
                        mailparser = new MailParser();

                        // setup an event listener when the parsing finishes
                        mailparser.on("end", function (mail_object) {
                            //messages.push(mail_object);
                            console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
                            console.log("Subject:", mail_object.subject); // Hello world!
                            //console.log("Text body:", mail_object.text); // How are you today
                            console.log("Date:", mail_object.date); // How are you today
                            console.log("===========================================");
                        });
                        mailparser.write(buffer);
                        mailparser.end();
                    }
                });
            });
            msg.once('attributes', function (attrs) {
                // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', function () {
                console.log(prefix + 'Finished');
            });
        });
        f.once('error', function (err) {
            console.log('Fetch error: ' + err);
        });
        f.once('end', function () {
            console.log('Done fetching all messages!');
            //callBack(messages);
            imap.end();
        });
    });

});

mailListener.on("server:disconnected", function(){
    console.log("imapDisconnected");
});

mailListener.on("error", function(err){
    console.log(err);
});

mailListener.on("mail", function(mail){
    console.log(mail);
});

mailListener.on("attachment", function(attachment){
    console.log(attachment);
});

