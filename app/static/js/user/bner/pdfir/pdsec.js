$(() => {
	/* ======== 系列的信息页面和添加页面的切换 ======*/
	$("#pdsecAddPageShow").click((e) => {
		$("#pdsecsPage").hide();
		$("#pdsecAddPage").show();
	})
	$("#pdsecsPageShow").click((e) => {
		$("#pdsecAddPage").hide();
		$("#pdsecsPage").show();
	})
})