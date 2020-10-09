$(function() {
	let qrCodeObjDiv = $("#qrCodeObjDiv")[0]	// HTML DOM Object
	let qrCodeObjStr = $("#qrCodeObjStr").val()
	let qrcodeObj = new QRCode(qrCodeObjDiv, {
		text: qrCodeObjStr,
		width: 128,
		height: 128,
		colorDark : "#000000",
		colorLight : "#ffffff",
		correctLevel : QRCode.CorrectLevel.H
	});

	$(".qrCodeCompdStr").each(function(index,elem) {
		let compdId = ($(this).attr("id")).split("-")[1]
		let qrCodeCompdDiv = $("#qrCodeCompdDiv-"+compdId)[0];
		let qrCodeCompdStr = $(this).val();
		let qrcodeCompd = new QRCode(qrCodeCompdDiv, {
			text: qrCodeCompdStr,
			width: 128,
			height: 128,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});
	})
})