$(document).ready(function(){

    $("#content").scroll(function(){
      if($(this).scrollTop() > 25){
        $("#toolbar").addClass("shadow");
      }
      else
        $("#toolbar").removeClass("shadow");
    });
});


function showProcessList(){
  $("#process-list").addClass("show");
  $("#navbar").addClass("blur");
  $("#container").addClass("blur");
  $("#wrapper").css("display", "block");
  $("#addNewProcess").animate({bottom: "20px"}, "slow");
}
function hideProcessList(){
  $("#process-list").removeClass("show");
  $("#navbar").removeClass("blur");
  $("#container").removeClass("blur");
  $("#wrapper").css("display", "none");
  $("#addNewProcess").animate({bottom: "-100px"}, "fast");
}
