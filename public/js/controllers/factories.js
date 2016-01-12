/**
 * Created by Masoud on 1/7/2016.
 */


sepehr.factory('mailFactory', function ($q) {
    var factory = {};
    var handler = result;



    factory.getBox = function (box, from, to) {
        var deffered = $q.defer();
        //SQLite.selectMail("folder = '"+box+"'", from+', '+to,function(tx) {
        SQLite.selectMail("folder = '"+box+"'","",function(tx) {
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
        handler(mail,resultCallBack);
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
    var list = [];

    factory.getAllProcessors = function () {
        var deffered = $q.defer();
        ProcessorDB.find({},function(err,data){
            if(!err){
                list = data;
                deffered.resolve(list);
            }
            else{
                deffered.reject(err);
            }
        });

        return deffered.promise;

    };
    factory.getP = function(id){
        for(var i = 0; i<list.length ; i++)
            if(list[i]._id == id)
                return list[i];
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
