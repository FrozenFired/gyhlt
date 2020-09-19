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
		}
	})
})