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

	$("#codeIpt").blur(function(e) {
		let code = $("#codeIpt").val();
		$("#picName").val(code);
	})
	$("#pdfirForm").submit(function(e) {
		let code = $("#codeIpt").val();
		if(!code || code.length < 1){
			alert('请输入系列名称');
			e.preventDefault();
		}
		// else if(!code || code.length < 2){
		// 	alert('请输入正确的系列编号');
		// 	e.preventDefault();
		// }
	})

	$("#despIpt").val($("#despData").val())
	$("#webNoteIpt").val($("#webNoteData").val())
	
	$("#pdfirUpForm").submit(function(e) {
		let code = $("#codeIpt").val();
		
		if(!code || code.length < 2){
			alert('请输入正确的系列名称');
			e.preventDefault();
		}
	})
})