$(function() {
	$(".buyBrandUpClick").click(function(e) {
		let field = $(this).attr("id").split('-')[1]
		let id = $(this).attr("id").split('-')[2]
		$("#form-"+field+"-obj").toggle();
	})
})