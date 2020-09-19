$(() => {
	/* ======== 询价单下的商品添加页面的切换 ======*/
	$("#qunpdAddPageShow").click((e) => {
		$("#qunpdsPage").hide();
		$("#qunpdAddPage").show();
	})
	$("#qunpdsPageShow").click((e) => {	// 取消添加
		$("#qunpdAddPage").hide();
		$("#qunpdsPage").show();
	})
})