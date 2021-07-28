$("#trading-stats-button").on("click", function(){
  $("#account-info-button").css("border", "0 gray solid");
  $("#table-2").addClass("hidden");
  $("#table-1").removeClass("hidden");
  $("#trading-stats-button").css("border", "2px gray solid");
})

$("#account-info-button").on("click", function(){
  $("#account-info-button").css("border", "2px gray solid");
  $("#trading-stats-button").css("border", "0 gray solid");
  $("#table-1").addClass("hidden");
  $("#table-2").removeClass("hidden");
})
