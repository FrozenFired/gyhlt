$(function() {

	$("#noteIpt").val($("#noteData").val())

	$("#codeIpt").blur(function(e) {
		let code = $("#codeIpt").val();
		if(!code || code.length < 2) {
			$("#codeOpt").text("请输入正确的产品价格编号")
		} else {
			$("#codeOpt").text("")
		}
	})

	$("#priceIpt").blur(function(e) {
		let price = $("#priceIpt").val();
		if(!price || !isFloat(price)) {
			$("#priceOpt").text("请输入正确的产品价格编号")
		} else {
			$("#priceOpt").text("")
		}
	})

	$("#pdthdForm").submit(function(e) {
		let code = $("#codeIpt").val();
		let price = $("#priceIpt").val();
		let pdsec = $("#pdsecIpt").val();

		let materIpt = "";
		$(".materIpt").each(function(index,elem) {
			let str = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '');
			if(str && str.length > 0) {
				materIpt += str + " ";
			}
		})
		let craftIpt = "";
		$(".craftIpt").each(function(index,elem) {
			let str = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '');
			if(str && str.length > 0) {
				craftIpt += str + " ";
			}
		})
		console.log(materIpt)
		console.log(materIpt.length)

		if(!code || code.length < 2) {
			alert('请输入正确的产品价格编号')
			$("#codeIpt").focus()
			e.preventDefault();
		} else if(!price || !isFloat(price)) {
			alert('请输入正确的产品价格')
			$("#priceIpt").focus()
			e.preventDefault();
		} else if(!pdsec || pdsec.length < 20) {
			alert("请选择产品的品牌")
			e.preventDefault();
		} else if(!materIpt || materIpt.length < 2) {
			alert("请输入材质")
			e.preventDefault();
		} else if(!craftIpt || craftIpt.length < 2) {
			alert("请输入工艺/面料/材质")
			e.preventDefault();
		}
	})
})