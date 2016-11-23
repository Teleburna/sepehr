/**
 * Created by Masoud on 29/08/2014.
 */
var fs = require('fs');
var path = require('path');
global.GUI = require('nw.gui');
global.APP_DIR = global.GUI.App.dataPath ;
global.ATTACHMENT_DIR = global.APP_DIR +"\\attachments";
//console.debug("Dir Is:"+global.APP_DIR );
var dataBase = require('nedb');
global.NEDB = dataBase;
global.localStorage = localStorage;
//global.openDatabase = openDatabase;

var db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
var gui = require('nw.gui');
var Window = gui.Window.get();
Window.resizeTo(1000, 600);
Window.moveTo(100,10);
if(localStorage.first == null){
    console.debug("Yes,its First Time");
    fs.mkdirSync(global.ATTACHMENT_DIR,true);
    window.alert("Hi, My name is Sepehr and nice to meet you.\nLets take a look around then setup your own mail listener from option menu.");
    localStorage.first = "first";
    sessionStorage.first = "yes";
}
if(localStorage.hasListener != "true"){
    window.alert("Sorry, I Couldn't find any mail listener. Please setup your own mail listener from option menu.");
}
else{
    //console.debug("No,it isnt First Time");
}

/*var gmail = gui.Window.get(window.open('https://gmail.com',{
 position: 'center',
 width: 600,
 toolbar:false,
 height: 300}));
 gmail.title = "Gmail";
 main.title = "Sepehr";
 main.moveBy(1,1);
 main.resizeBy(1,1);
 main.on('resize',function(){
 gmail.resizeTo(gmail.width,main.height);
 });
 main.on('move',function(){
 gmail.moveTo(main.x+main.width, main.y);
 });*/