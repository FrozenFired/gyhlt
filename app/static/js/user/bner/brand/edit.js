$(function() {
	$("#crtImg").click(function(e) {
		$("#picUpload").click();
	})
	$("#picUpload").change(function(e) {
		var f = document.getElementById('picUpload').files[0];
		var src = window.URL.createObjectURL(f);
		document.getElementById('crtImg').src = src;
		$("#crtImg").removeClass("rounded-circle")
	})

	/* ============== Basic ============== */
	$("#despIpt").val($("#despData").val())
	$("#webNoteIpt").val($("#webNoteData").val())

	$("#brandUpForm").submit(function(e) {
		if(0){
			e.preventDefault();
		}
	})
	/* ============== Basic ============== */
})