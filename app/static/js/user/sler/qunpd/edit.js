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

	$("#objectForm").submit(function(e) {
		let brandNomeIpt = $("#brandNomeIpt").val();
		let firNomeIpt = $("#firNomeIpt").val();
		let specfIpt = $("#specfIpt").val();
		let materIpt = $("#materIpt").val();
		if(!brandNomeIpt) {
			alert("请输入品牌")
			e.preventDefault();
		} else if(!firNomeIpt) {
			alert("请输入系列名称")
			e.preventDefault();
		} else if(!specfIpt) {
			alert("请输入产品规格")
			e.preventDefault();
		} else if(!materIpt) {
			alert("请输入材质")
			e.preventDefault();
		}
	})

	$(".picImg").click(function(e) {
		let id = $(this).attr("id").split('-')[1];
		$("#ipt-"+id).click();
	})
	$(".picIpt").change(function(e) {
		let id = $(this).attr("id").split('-')[1];
		var f = document.getElementById('ipt-'+id).files[0];
		var src = window.URL.createObjectURL(f);
		document.getElementById('img-'+id).src = src;
		$("#img-"+id).removeClass("rounded-circle")
	})
})