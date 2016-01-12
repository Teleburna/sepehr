/**
 * Created by Masoud on 1/12/2016.
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

sepehr.run(function( $rootScope){

    $rootScope.processor = {name:"", email:"", tags:""};
    $rootScope.hasProcessor = false;
    ProcessorDB.find({current:true},function(err,data){
        if(!err && data.length > 0){
            $rootScope.processor = data[0];        }
    });
});
