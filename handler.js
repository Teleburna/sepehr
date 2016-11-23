
var exec = require('child_process').execFile,
    child;
var fs = require('fs');
var mail = {
    subject:"ds",
    from:[{address:"b.bakhshi94@gmail.com"}],
    text:"body",
    attachments:[{generatedFileName:"9122471-1.zip"}],
    messageId:"CAPE9n4xBEJ=iZ5oJNwiRWSr-obOqbcQ3D8w060rUeuB1hnmNNA@mail.gmail.com"
};
var localStorage = {script:"D:\\Documents\\Sepehr\\SepehrJs\\Sepehr-DS-Checker.exe"};
global.ATTACHMENT_DIR = "C:\\Users\\user\\AppData\\Local\\sepehr\\attachments";
startProcess = function(mail,callback){
    /*var attachments = []
    for(var i=0 ; i<mail.attachments.length; i++){
        attachments.push(path+"/"+mail.attachments[i].filename);
    }*/
    var res = {};
    var err = null;
    options = ["user",mail.from[0].address,mail.subject,
        mail.text];
    if(mail.attachments){
        for(var i =0 ; i< mail.attachments.length; i++)
            options.push(global.ATTACHMENT_DIR+"\\"+mail.messageId+"\\in\\"+mail.attachments[i].generatedFileName);
    }
//child = exec('Sepehr-ExerciseChecker.exe',["user","shahrzad_ZA@yahoo.com","ds","This Is Body",'C:\\Sepehr\\Exercises\\9111257\\SELECTIONSORT\\9111257-1.zip'],{cwd:"D:\\Documents\\Visual Studio 2012\\Projects\\Sepehr-ExerciseChecker\\Sepehr-ExerciseChecker\\obj\\Debug"},
    //child = exec('Sepehr-ExerciseChecker.exe',options
    child = exec(localStorage.script,options
        //,{cwd:"D:\\Documents\\Visual Studio 2012\\Projects\\Sepehr-ExerciseChecker\\Sepehr-ExerciseChecker\\obj\\Debug"}
        ,
  function (error, stdout, stderr) {
      //console.debug('stdout: ' + stdout);
      //console.debug('stderr: ' + stderr);
      var out = stdout.substring(stdout.indexOf('{'),stdout.lastIndexOf('}')+1);
      //console.debug(out);
      if(out == ""){
          err = "Unknown Mail";
          return;
      }

        var out2 = {};
      try {
          out2 = JSON.parse(out);
          out2.body = parseBody(out2.body);
      }catch (ex){
          out2 = parseBody(out);
          out2 = JSON.parse(out2);

      }
      res = out2;
      res.text = res.body;
      delete res.body;
      console.debug(res);

      if (error !== null) {
          err = error;
          console.debug(error);
      }
  });
child.on('close', function (code) {
    console.debug('Closed With Code : ' + code);
    callback(err,res, code);
});
};
var parseBody = function(body){
    var newBody = "";
    var i =body.indexOf('$');
    while(i != -1 ){
        newBody += body.substring(0,i);
        switch (body.charAt(i+1)){
            case 'n':newBody += "\n"; break;
            case 't':newBody += "\t"; break;
            case '"':newBody += "\\\""; break;
            case '\\':newBody += "\\"; break;
            case 'r':newBody += "\r"; break;
        }
        body = body.substring(i+2,body.length);
        i =body.indexOf('$');
    }
    newBody += body;
    return newBody;
};

/*var temp = '{"subject":"Result","to":"b.bakhshi94@gmail.com","body":"Test: SELECTIONSORT$tExit Code: 100$nTest: SELECTIONSORT$tExit Code: 100$n"}';
var temp2 = '{"subject":"Result","to":"b.bakhshi94@gmail.com","body":"Test: SELECTIONSORT\tExit Code: 100\nTest: SELECTIONSORT\tExit Code: 100\n}';
//res = parseBody(out);
res = JSON.parse(temp);
//res2 = parseBody(res);
res2.body = parseBody(res.body);
console.log(res2);*/

/*startProcess(mail,function(err, res, code){
    console.log(res);
});*/
startNewProcess = function(mail,callback){
    /*var attachments = []
     for(var i=0 ; i<mail.attachments.length; i++){
     attachments.push(path+"/"+mail.attachments[i].filename);
     }*/
    var res = {};
    var err = null;
    options = ["user",mail.from[0].address,mail.subject,
        mail.text];
    if(mail.attachments){
        for(var i =0 ; i< mail.attachments.length; i++)
            options.push(global.ATTACHMENT_DIR+"\\"+mail.messageId+"\\in\\"+mail.attachments[i].generatedFileName);
    }
//child = exec('Sepehr-ExerciseChecker.exe',["user","shahrzad_ZA@yahoo.com","ds","This Is Body",'C:\\Sepehr\\Exercises\\9111257\\SELECTIONSORT\\9111257-1.zip'],{cwd:"D:\\Documents\\Visual Studio 2012\\Projects\\Sepehr-ExerciseChecker\\Sepehr-ExerciseChecker\\obj\\Debug"},
    //child = exec('Sepehr-ExerciseChecker.exe',options
    child = exec(localStorage.script,options
        ,
        //{cwd:"D:\\Documents\\Visual Studio 2012\\Projects\\Sepehr-ExerciseChecker\\Sepehr-ExerciseChecker\\obj\\Debug"},
        function (error, stdout, stderr) {
            //console.debug('stdout: ' + stdout);
            //console.debug('stderr: ' + stderr);
            var out = stdout.substring(stdout.indexOf('{'),stdout.lastIndexOf('}')+1);
            console.debug(out);
            if(out == ""){
                err = "Unknown Mail";
                return;
            }

            res = JSON.parse(out);
            res.text = parseBody(res.body);
            delete res.body;
            console.debug(res);

            if (error !== null) {
                err = error;
                console.debug(error);
            }
        });
    child.on('close', function (code) {
        console.debug('Closed With Code : ' + code);
        fs.readFile(global.ATTACHMENT_DIR+"\\"+mail.messageId+"\\in\\subject.txt", 'utf8', function(err, data) {
            if (err) throw err;
            console.log('OK: Sub');
            console.log(data);
            res.subject = data;
            fs.readFile(global.ATTACHMENT_DIR+"\\"+mail.messageId+"\\in\\head.txt", 'utf8', function(err, head) {
                if (err) throw err;
                console.log('OK: head');
                console.log(head);
                res.to = head;
                fs.readFile(global.ATTACHMENT_DIR+"\\"+mail.messageId+"\\in\\body.txt", 'utf8', function(err, body) {
                    if (err) throw err;
                    console.log('OK: body');
                    console.log(body);
                    res.text = body;
                    callback(err,res, code);
                });
            });
        });
    });
};
