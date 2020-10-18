$(function() {
	// 初始化数量和总金额
	$("#span-quantTotal").text($("#ipt-quantTotal").val())
	$("#span-qntPrImp").text(parseFloat($("#ipt-qntPrImp").val()).toFixed(2))
	$("#span-dinPrImp").text(parseFloat($("#ipt-dinPrImp").val()).toFixed(2))
	$("#span-dutPrImp").text(parseFloat($("#ipt-dutPrImp").val()).toFixed(2))
})