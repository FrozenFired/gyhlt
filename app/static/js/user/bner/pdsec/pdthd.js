$(() => {
	/* ======== 系列的信息页面和添加页面的切换 ======*/
	$("#pdthdAddPageShow").click((e) => {
		$("#pdthdsPage").hide();
		$("#pdthdAddPage").show();
	})
	$("#pdthdsPageShow").click((e) => {
		$("#pdthdAddPage").hide();
		$("#pdthdsPage").show();
	})
})