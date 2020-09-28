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

	$("#addForm").submit(function(e) {
		let title = $("#titleIpt").val();
		if(!title || title.length < 1){
			alert('请输入主题');
			e.preventDefault();
		}
	})

	$("#despIpt").val($("#despData").val())
	$("#contentIpt").val($("#contentData").val())

	$("#upForm").submit(function(e) {
	})
})