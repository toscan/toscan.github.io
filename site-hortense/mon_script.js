jQuery(document).ready(function($) {
	$("#hide").click(function(){
 		 $(".cacher").hide();
		});
	$(".cacher").css("background-color", "#fffbda");

	$("#dpoudlard").click(function(){
		$("#lpoudlard").show();
			$("#lazkaban").hide();
			$("#lpré").hide();
			$("#lchemint").hide();
	});

	$("#dazkaban").click(function(){
		$("#lazkaban").show();
			$("#lpoudlard").hide();
			$("#lpré").hide();
			$("#lchemint").hide();
	});
	$("#dpré").click(function(){
		$("#lpré").show();
			$("#lpoudlard").hide();
			$("#lazkaban").hide();
			$("#lchemint").hide();
	});
	$("#dchemint").click(function(){
		$("#lchemint").show();
			$("#lpoudlard").hide();
			$("#lazkaban").hide();
			$("#lpré").hide();
	});

});