/**
 * Created by Masoud on 13/08/2014.
 */
var os = require('os');
var db = require('./public/js/core/db/db.js');
var mailer = require('./public/js/core/mailer/main');

sepehr = angular.module('sepehr', ['ngRoute', 'pascalprecht.translate', 'ngSanitize'] );

sepehr.config(['$routeProvider', function ($routeProvider,$location) {

    var dirname = require('./public/js/core/util').dirname;

    console.debug(dirname);
    console.debug(os.tmpdir());
    //console.debug($location.path);
    console.debug(window.location.href);



    startMailListener();


    mailEvent.on("server:connected",function(){
        console.debug("Connected");
    });



    /*HandlersDB = new global.NEDB({ filename: path.join(global.APP_DIR, 'Sepehr-Handlers.db') , autoload: true});
    var routes = [];
    HandlersDB.find({ }, function (err, docs) {
        for(var i=0 ; i<docs.length; i++){
            if(docs[i].routes){

            }
        }
    });*/

    $routeProvider
        .when('/inbox', {
            templateUrl: 'public/partials/inbox.html',
            controller: 'inboxController'
        })
        .when('/outbox', {
            templateUrl: 'public/partials/outbox.html',
            controller: 'outboxController'
        })
        .when('/inbox/:id', {
            templateUrl: 'public/partials/message.html',
            controller: 'messageController'
        })
        .when('/outbox/:id', {
            templateUrl: 'public/partials/message.html',
            controller: 'messageController'
        })
        .when('/setting', {
            templateUrl: 'public/partials/setting.html',
            controller: 'ProcessorController'
        })
        .when('/new', {
            templateUrl: global.APP_DIR+'/new.html',
            controller: 'NewController'
        })
        .otherwise({
            redirectTo: '/inbox'
        });

}]);

sepehr.factory('mailFactory', function ($q) {
    var factory = {};
    var handler = result;



    factory.getBox = function (box, from, to) {
        var deffered = $q.defer();
        SQLite.selectMail("folder = '"+box+"'", from+', '+to,function(tx) {
                deffered.resolve(tx);
        });
        return deffered.promise;
    };

    var resultCallBack = function(err,mail,code){
        console.log("Mail Resolved");
        if(err){
            console.debug(err);
            return;
        }
        mail.folder = "OUTBOX";


        SQLite.insertMail(function(data) {

            if(!data.err) {
                //mailEvent.emit("mail", mail);
                console.log("Mail Added to OutBox");
            }
        });

    };
    factory.getResult = function(mail){
      handler.getResult(mail,resultCallBack);
    };
    factory.getMessage = function (id) {
        var deffered = $q.defer();
      /*  db.MailDB.find({_id:id},function(err,data){
            if(!err){
                deffered.resolve(data[0]);
            }
            else{
                deffered.reject(err);
            }
        });
*/
        SQLite.selectMail("id = "+id+"",null,function(tx) {
            deffered.resolve(tx[0]);
        });

        return deffered.promise;
    };
    return factory;
});

sepehr.controller('inboxController',function($scope,mailFactory){
    $scope.mails = [];
    $scope.ready = true;
    $scope.allSelected = false;

    mailFactory.getBox('INBOX',0,10).then(function (data) {
        $scope.mails = data;
        $scope.ready = true;
    });

    mailEvent.on("mail", function(mail){

        console.debug("New Mail In Factory",mail);
        $scope.mails.splice(0, 0, mail);
        //handler(mail,resultCallBack);
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
sepehr.controller('ProcessorController',function($scope,$routeParams){

    $scope.handlerName = localStorage.listenerName || "";
    $scope.email = localStorage.email || "";
    $scope.password = localStorage.password || "";
    $scope.scriptPath = localStorage.script || "";
    $scope.tags = localStorage.tags || "";
    emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


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
        if ( valid ) {
            localStorage.listenerName = $scope.handlerName;
            localStorage.email = $scope.email;
            localStorage.password = $scope.password;
            localStorage.script = $scope.scriptPath;
            localStorage.tags = $scope.tags;
            localStorage.hasListener = "true";
            location.reload();
        }
        return valid;
    }
});