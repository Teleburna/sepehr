/**
 * Created by Masoud on 1/7/2016.
 */

var os = require('os');

sepehr = angular.module('sepehr', ['ngRoute', 'pascalprecht.translate', 'ngSanitize'] );

sepehr.config(['$routeProvider', function ($routeProvider) {

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
        .when('/setting/:id', {
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
sepehr.factory('processorFactory', function ($q) {
    var factory = {};
    var handler = result;


    factory.getAllProcessors = function () {
        var deffered = $q.defer();
        ProcessorDB.find({},function(err,data){
            if(!err){
                deffered.resolve(data);
            }
            else{
                deffered.reject(err);
            }
        });

        return deffered.promise;

    };
    factory.getProcessor = function (id) {
        var deffered = $q.defer();
        ProcessorDB.find({_id:id},function(err,data){
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
