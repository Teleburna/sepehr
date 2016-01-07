
var exec = require('child_process').execFile,
    child;
var result = function(mail,callback){
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
            options.push(global.ATTACHMENT_DIR+"\\"+mail.attachments[i].fileName);
    }
//child = exec('Sepehr-ExerciseChecker.exe',["user","shahrzad_ZA@yahoo.com","ds","This Is Body",'C:\\Sepehr\\Exercises\\9111257\\SELECTIONSORT\\9111257-1.zip'],{cwd:"D:\\Documents\\Visual Studio 2012\\Projects\\Sepehr-ExerciseChecker\\Sepehr-ExerciseChecker\\obj\\Debug"},
    //child = exec('Sepehr-ExerciseChecker.exe',options
    child = exec(localStorage.script,options
        ,{cwd:"D:\\Documents\\Visual Studio 2012\\Projects\\Sepehr-ExerciseChecker\\Sepehr-ExerciseChecker\\obj\\Debug"},
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
    callback(err,res, code);
});
};
var parseBody = function(body){
    var newBody = ""
    var i =body.indexOf('$');
    while(i != -1 ){
        newBody += body.substring(0,i);
        switch (body.charAt(i+1)){
            case 'n':newBody += "\n"; break;
            case 't':newBody += "\t"; break;
            case '"':newBody += "\""; break;
            case '\\':newBody += "\\"; break;
            case 'r':newBody += "\r"; break;
        }
        body = body.substring(i+2,body.length);
        i =body.indexOf('$');
    }
    newBody += body;
    return newBody;
};
