$(function() {
	/* ============== Basic ============== */
	$("#despIpt").val($("#despData").val())

	$("#basicUpdShow").click(function(e) {
		$(".basicElem").hide();
		$(".basicUp").show();
	})
	$("#basicElemShow").click(function(e) {
		$(".basicUp").hide();
		$(".basicElem").show();
	})
	$("#basicTogg").click(function(e) {
		$(".basic").toggle();
	})

	$("#pdsecUpdForm").submit(function(e) {
		if(0){
			e.preventDefault();
		}
	})
	/* ============== Basic ============== */

	$("#photoImg").dblclick(function(e) {
		$("#picUpload").click();
		$("#subPhoto").show();
	})
	$("#picUpload").change(function(e) {
		var f = document.getElementById('picUpload').files[0];
		var src = window.URL.createObjectURL(f);
		document.getElementById('photoImg').src = src;
		$("#photoImg").removeClass("rounded-circle")
	})
})