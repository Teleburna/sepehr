/**
 * Created by Masoud on 13/08/2014.
 */
var os = require('os');
var db = require('./public/js/core/db/db.js');
var mailer = require('./public/js/core/mailer/main');

sepehr = angular.module('sepehr', ['ngRoute', 'pascalprecht.translate'] );

sepehr.config(['$routeProvider', function ($routeProvider,$location) {

    var dirname = require('./public/js/core/util').dirname;

    console.log(dirname);
    console.log(os.tmpdir());
    //console.log($location.path);
    console.log(window.location.href);



    mailer.start();

    mailer.on("mail", function(mail){

        console.log("New Mail In Factory",mail);
        factory.inBox.push(mail);
        handler(mail,resultCallBack);
    });

    mailer.on("server:connected",function(){
        console.log("Connected");
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

    factory.getBox = function (box) {
        var deffered = $q.defer();
        if(factory[box]){
            deffered.resolve(factory[box]);
            deffered.promise;
        }
        factory[box] = [];
        db.MailDB.find({folder:box},function(err,docs){
            if(!err){
                for(var i=0 ; i<docs.length; i++){
                    var doc = docs[i];
                    var dateObj = new Date(doc.date);
                    var dateString = dateObj.getMonth()+"/"+dateObj.getDate();
                    doc.date = dateString;
                    factory[box].push(doc);
                }
                deffered.resolve(docs);
            }
            else{
                deffered.reject(err);
            }
        });
        return deffered.promise;
    };

    var resultCallBack = function(err,result,code){
        console.log("Mail Resolved");
        if(err){
            console.log(err);
            return;
        }
        result.folder = "OUTBOX";
        db.MailDB.insert(result,function(err,data) {
            if(err){
                console.log(err);
            }
            else{
                console.log("OutBox Ready");
                factory.outBox.push(data);
            }
        });
    };
    factory.getResult = function(mail){
      handler.getResult(mail,resultCallBack);
    };
    factory.getMessage = function (id) {
        var deffered = $q.defer();
        db.MailDB.find({_id:id},function(err,data){
            if(!err){
                deffered.resolve(data[0]);
            }
            else{
                deffered.reject(err);
            }
        });
        return deffered.promise;
    };
    return factory;
});

sepehr.controller('inboxController',function($scope,mailFactory){
    $scope.mails = [];
    $scope.ready = true;
    mailFactory.getBox('INBOX').then(function (data) {
        $scope.mails = data;
        $scope.ready = true;
    });


});
sepehr.controller('outboxController',function($scope,mailFactory){

    $scope.mails = [];
    $scope.ready = true;
    mailFactory.getBox('OUTBOX').then(function (data) {
        $scope.mails = data;
        $scope.ready = true;
    });
});
sepehr.controller('messageController',function($scope,mailFactory,$routeParams,$sce){
    mailFactory.getMessage($routeParams.id).then(function (data) {
        $scope.mail = data;
        if(data.html != null){
            $scope.mail.text = $sce.trustAsHtml(data.html);
        }
        else{
            $scope.mail.text = $sce.trustAsHtml(data.text);
        }
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