/**
 * Created by Masoud on 21/08/2014.
 */
sepehr.factory('UsersFactory',function(){
    var factory = {};
    var UsersDB = new global.NEDB({ filename: path.join(global.APP_DIR, 'users.db') , autoload: true});
    factory.addUser = function(user){
        UsersDB.insert(user,function(err,docs){

        })
    };

    factory.getUsers = function(callBack){
        UsersDB.find({},{},function(err,users){
            callBack(users);
        })
    };

    return factory;
});
sepehr.controller('UsersController',function($scope,UserFactory){

});
sepehr.controller('NewController',function($scope,UserFactory){

});