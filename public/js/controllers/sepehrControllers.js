/**
 * Created by Masoud on 13/08/2014.
 */
var nodemailer = require('nodemailer');
sepehr.controller('inboxController',function($scope,mailFactory){
    $scope.mails = [];
    $scope.ready = true;
    $scope.allSelected = false;

    var user = localStorage.email.substring(0, localStorage.email.indexOf("@"));
    var smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: localStorage.email,
            pass: localStorage.password
        }
    };
    var transporter = nodemailer.createTransport(smtpConfig);//'smtps://'+user+'%40gmail.com:'+localStorage.password+'@smtp.gmail.com');
    /*var data = {
        from: 'Sepehr <mr.maj73@gmail.com>', // sender address
        to: "mr.maj73@gmail.com", // list of receivers
        subject: "Hello", // Subject line
        text: "World"//, // plaintext body
        //html: '<b>Hello world</b>' // html body
    };
    transporter.sendMail(data, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });*/

    mailFactory.getBox('INBOX',0,10).then(function (data) {
        $scope.mails = data;
        $scope.ready = true;
    });

    var resultCallBack = function(err,mail,code){
        try{
        console.log("Mail Resolved");
        }catch (e){}
        if(err){
            try{
            console.debug(err);
            }catch (e){}
            return;
        }
        mail.folder = "OUTBOX";


        var mailOptions = {
            from: 'Sepehr <mr.maj73@gmail.com>', // sender address
            to: mail.to, // list of receivers
            subject: mail.subject, // Subject line
            text: mail.text//, // plaintext body
            //html: '<b>Hello world</b>' // html body
        };
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                try{
                console.log(error);
                }catch (e){}
                return;
            }
            try{
            console.log('Message sent: ' + info.response);
            }catch (e){}
        });

        SQLite.insertSimpleMail(mail, function(data) {

            try{
            if(!data.err) {
                //mailEvent.emit("mail", mail);
                console.log("Mail Added to OutBox");


            }
            else{
                console.log("Mail Not Added to OutBox");

            }
            }catch (e){}
        });

    };
    mailEvent.on("mail", function(mail){

        //console.debug("New Mail In Factory",mail);
        mail.fromName = mail.from[0].name || mail.from[0].address;
        $scope.mails.splice(0, 0, mail);
        startProcess(mail,resultCallBack);
        //startNewProcess(mail,resultCallBack);

    });

    $scope.toggleCheck = function(mail){
      mail.check = !mail.check;
    };

    $scope.checkAll = function(){
        $scope.allSelected = !$scope.allSelected;
        var i, len = $scope.mails.length;
        for(i = 0 ; i<len ; i++){
            $scope.mails[i] = $scope.allSelected;
        }
    }


});
sepehr.controller('outboxController',function($scope,mailFactory){

    $scope.mails = [];
    $scope.ready = true;
    mailFactory.getBox('OUTBOX',0,10).then(function (data) {
        $scope.mails = data;
        $scope.ready = true;
    });
});
sepehr.controller('messageController',function($scope,mailFactory,$routeParams,$sce){
    mailFactory.getMessage($routeParams.id).then(function (data) {
        $scope.mail = data;
        $scope.mail.text = $sce.trustAsHtml($scope.mail.text);

        /*if(data.html && data.html != ""){
            $scope.mail.text = data.html;//$sce.trustAsHtml(data.html);
        }
        else{
            $scope.mail.text = data.text;//$sce.trustAsHtml(data.text);
        }*/
    });
});
sepehr.controller('MenuController',function($scope){
    $scope.boxes = [
        {
            name:"Inbox",
            path:"#inbox"
        },
        {
            name:"Outbox",
            path:"#outbox"
        },
        {
            name:"Sent",
            path:"#outbox"
        },
        {
            name:"Trash",
            path:"#outbox"
        }
    ]
});
sepehr.controller('ProcessorController',function($scope,$routeParams, $rootScope, processorFactory){

    $scope.processor = {};
    if(!$routeParams.id) {
        $scope.handlerName = localStorage.listenerName || "";
        $scope.email = localStorage.email || "";
        $scope.password = localStorage.password || "";
        $scope.scriptPath = localStorage.script || "";
        $scope.tags = localStorage.tags || "";
    }
    else{
        processorFactory.getProcessor($routeParams.id).then(function (data) {

            $scope.processor = data;

            $scope.handlerName = data.name;
            $scope.email = data.email;
            $scope.password = data.password;
            $scope.scriptPath = data.scriptPath;
            $scope.tags = data.tags;
            $scope.ready = true;
        });
    }
    emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


     $scope.setFiles = function(elem){
         $scope.processor.scriptPath = elem.files[0].path;
     };
     $scope.addHandler = function(){



    function updateTips( t ) {
     tips
     .text( t )
     .addClass( "ui-state-highlight" );
     setTimeout(function() {
     tips.removeClass( "ui-state-highlight", 1500 );
     }, 500 );
     }
     function checkLength( o, n, min, max ) {
     if ( o.val().length > max || o.val().length < min ) {
     o.addClass( "ui-state-error" );
     updateTips( "Length of " + n + " must be between " +
     min + " and " + max + "." );
     return false;
     } else {
     return true;
     }
     }
     function checkRegexp( o, regexp, n ) {
     if ( !( regexp.test( o.val() ) ) ) {
     o.addClass( "ui-state-error" );
     updateTips( n );
     return false;
     } else {
     return true;
     }
     }

    var valid = true;
        //allFields.removeClass( "ui-state-error" );
        /*valid = valid && checkLength( name, "username", 3, 16 );
         valid = valid && checkLength( email, "email", 6, 80 );
         valid = valid && checkLength( password, "password", 5, 16 );
         valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
         valid = valid && checkRegexp( email, emailRegex, "eg. ui@jquery.com" );
         valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );*/
         if(valid) {
            localStorage.listenerName = $scope.processor.name;
            localStorage.email = $scope.processor.email;
            localStorage.password = $scope.processor.password;
            localStorage.script = $scope.processor.scriptPath;
            localStorage.tags = $scope.processor.tags;
            localStorage.hasListener = "true";

             $rootScope.processor = $scope.processor;

             $scope.processor.current = true;
             if(!$routeParams.id) {
                 ProcessorDB.insert($scope.processor,function(err,data){
                     try {
                         if (!err) {
                             console.log("Processor Inserted");
                             $rootScope.$broadcast("processor", "refresh");
                         }
                         else {
                             console.log("Error In Saving Processor");
                         }
                     }catch (ex){}
                 });
             }
             else{
                 ProcessorDB.update({_id:$routeParams.id}, $scope.processor,function(err,data){
                     try {
                         if (!err) {
                             console.log("Processor Updated");
                             $rootScope.$broadcast("processor", "refresh");
                         }
                         else {
                             console.log("Error In Saving Processor");
                         }

                     }catch (ex){}
                 });
             }
        }
        return valid;
    }
});
sepehr.controller('ProcessorListController',function($scope, $location, processorFactory){

    $scope.processors = [];

    $scope.ready = false;

    $scope.refresh = function(){

        processorFactory.getAllProcessors().then(function (data) {
            $scope.processors = data;
            $scope.ready = true;
        });
    };

    $scope.$on("processor", function(event, data){
        try{
        console.log(data);
        }catch (ex){}
        $scope.refresh();
    });

    $scope.refresh();

     $scope.addProcessor = function() {

         $location.path( "/setting" );
     };

     $scope.editProcessor = function(processor) {

         $location.path( "/setting/"+processor._id );
     };
});