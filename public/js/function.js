var selectAll = false;
$(document).ready(function(){
    $(".checkbox").each(function(index, elem){
      $(elem).click(function(){
        swapCheckbox(elem);
      });
    });

    $("#content").scroll(function(){
      if($(this).scrollTop() > 25){
        $("#toolbar").addClass("shadow");
      }
      else
        $("#toolbar").removeClass("shadow");
    });
});

function swapCheckbox(elem){
  if($(elem).attr("check") == "true")
    $(elem).attr("check", "false");
  else
    $(elem).attr("check", "true");
}

function selectAllCheckboxes(){
  if(selectAll == false){
    $(".checkbox").each(function(index, elem){
      $(elem).attr("check", "true");
    });
    selectAll = true;
  }
  else{
    $(".checkbox").each(function(index, elem){
      $(elem).attr("check", "false");
    });
    selectAll = false;
  }
}

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
