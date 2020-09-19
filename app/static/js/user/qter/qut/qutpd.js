$(() => {
	/* ======== 询价单下的商品添加页面的切换 ======*/
	$("#qunpdAddPageShow").click((e) => {
		$("#qunpdsPage").hide();
		$("#qunpdAddPage").show();
	})
	$("#qunpdsPageShow").click((e) => {
		$("#qunpdAddPage").hide();
		$("#qunpdsPage").show();
	})

	/* ======== 询价单下的商品列表操作 ======*/
	/* ------- 更新 系列的场景图片 photo ----- */
	$("#photoCrt").dblclick(function(e) {
		$("#photoUpload").click();
	})
	$("#photoUpload").change(function(e) {
		var f = document.getElementById('photoUpload').files[0];
		var src = window.URL.createObjectURL(f);
		document.getElementById('photoCrt').src = src;

		$("#photoForm").show();
	})
	/* ------- 更新 产品的设计图片 sketch ----- */
	$("#sketchCrt").dblclick(function(e) {
		$("#sketchUpload").click();
	})
	$("#sketchUpload").change(function(e) {
		var f = document.getElementById('sketchUpload').files[0];
		var src = window.URL.createObjectURL(f);
		document.getElementById('sketchCrt').src = src;

		$("#sketchForm").show();
	})
})