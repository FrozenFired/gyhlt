$(() => {
	/* ======== 询价单下的商品添加页面的切换 ======*/
	$("#qutpdAddPageShow").click((e) => {
		$("#qutpdsPage").hide();
		$("#qutpdAddPage").show();
	})
	$("#qutpdsPageShow").click((e) => {	// 取消添加
		$("#qutpdAddPage").hide();
		$("#qutpdsPage").show();
	})
})