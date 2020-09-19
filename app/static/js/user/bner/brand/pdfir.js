$(() => {
	/* ======== 系列的信息页面和添加页面的切换 ======*/
	$("#pdfirAddPageShow").click((e) => {
		$("#pdfirsPage").hide();
		$("#pdfirAddPage").show();
	})
	$("#pdfirsPageShow").click((e) => {
		$("#pdfirAddPage").hide();
		$("#pdfirsPage").show();
	})
})