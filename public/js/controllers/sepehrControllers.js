/**
 * Created by Masoud on 13/08/2014.
 */

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
                     if(!err){
                         console.log("Processor Inserted");
                         $rootScope.$broadcast("processor","refresh");
                     }
                     else{
                         console.log("Error In Saving Processor");
                     }
                 });
             }
             else{
                 ProcessorDB.update({_id:$routeParams.id}, $scope.processor,function(err,data){
                     if(!err){
                         console.log("Processor Updated");
                         $rootScope.$broadcast("processor","refresh");
                     }
                     else{
                         console.log("Error In Saving Processor");
                     }
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
        console.log(data);
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