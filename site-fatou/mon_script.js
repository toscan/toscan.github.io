jQuery(document).ready(function($) {
    $("#btn1").click(function(){
    $("ol").append("<li><a href='https://youtu.be/Koz393gAwjQ/'> 'Doin' Just Fine' </a></li>");
    $("ol").append("<li><p><a href='https://youtu.be/fV8vB1BB2qc/'> 'I'll Make Love To You' </a></p></li>");
    $("ol").append("<li><p><a href='https://youtu.be/2cb-ia6_NoE/'> 'Please don't Go'  </a></p></li>")
    $("ol").append("<li><p><a href='https://youtu.be/zDKO6XYXioc/'> 'End Of The Road' </a></p></li>");
    $("#btn1").hide();
  });
    $("#btn2").click(function(){
    $("ol").hide();
  });
    $("#btn2").click(function(){
    $("#btn1").show();
  });
    $("#flip").click(function(){
    $("#panel").slideDown("slow");
  });
     $("#panel").click(function(){
    $("#panel").slideUp("slow");
  });
    $("#flip2").click(function(){
    $("#panel2").slideDown("slow");
  });
    $("#panel2").click(function(){
    $("#panel2").slideUp("slow");
  });    
 });