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
    factory.inBox = [];
    factory.outBox = [];
    db.MailDB.find({ folder: 'INBOX' }, function (err, docs) {
        for(var i=0 ; i<docs.length; i++){
            var doc = docs[i];
            var dateObj = new Date(doc.date);
            var dateString = dateObj.getMonth()+"/"+dateObj.getDate();
            doc.date = dateString;
            factory.inBox.push(doc);
        }
    });
    db.MailDB.find({ folder: 'OUTBOX' }, function (err, docs) {

        for(var i=0 ; i<docs.length; i++){
            var doc = docs[i];
            var dateObj = new Date(doc.date);
            var dateString = dateObj.getMonth()+"/"+dateObj.getDate();
            doc.date = dateString;
            factory.outBox.push(doc);
        }
    });

    mailer.start();

    mailer.on("mail", function(mail){

        console.log("New Mail In Factory",mail)
        factory.inBox.push(mail);
        handler(mail,resultCallBack);
    });

    mailer.on("server:connected",function(){
       console.log("Connected");
    });



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
    $scope.mails = mailFactory.inBox;

});
sepehr.controller('outboxController',function($scope,mailFactory){
    $scope.mails = mailFactory.outBox;
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