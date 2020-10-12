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
		let firmCode = $("#firmCode").val();
		let code = $("#codeIpt").val();
		if(!firmCode || firmCode.length != Conf.codeLenFirm) {
			alert('请刷新查看');
		} else if(!code || code.length < 1) {
			alert('请输入产品编号')
		} else {
			$("#picName").val(firmCode+'_'+code)
		}
	})

	$("#pdsecForm").submit(function(e) {
		let firmCode = $("#firmCode").val();
		let code = $("#codeIpt").val();
		let pdfir = $("#pdfirIpt").val();
		let specIpt = $("#specIpt").val();

		if(!firmCode || firmCode.length != Conf.codeLenFirm) {
			alert('请刷新查看');
			e.preventDefault();
		} else if(!code || code.length < 1) {
			alert("请输入产品编号")
			e.preventDefault();
		} else if(!pdfir || pdfir.length < 20) {
			alert("产品所属系列错误, 请联系管理员")
			e.preventDefault();
		} else if(!specIpt || specIpt.length < 2) {
			alert("请填写产品规格")
			e.preventDefault();
		}
	})
})