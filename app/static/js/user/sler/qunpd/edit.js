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
	var ifNegativeFunc = function() {
		let num = $("#quantIpt").val();
		if(num < 0) {
			alert("数量不能是负数")
			$("#quantIpt").val(1)
		}
	}
	$("#quantIpt").blur(function(e) {
		ifNegativeFunc()
	})
	$("#quantIpt").change(function(e) {
		ifNegativeFunc()
	})
	$("#objectForm").submit(function(e) {
		let brandNomeIpt = $("#brandNomeIpt").val();
		let firNomeIpt = $("#firNomeIpt").val();
		let pdNomeIpt = $("#pdNomeIpt").val();
		let specfIpt = $("#specfIpt").val();
		let materIpt = $("#materIpt").val();
		let craftIpt = $("#craftIpt").val();
		let quantIpt = parseInt($("#quantIpt").val());
		if(!brandNomeIpt) {
			alert("请输入品牌")
			e.preventDefault();
		} else if(!firNomeIpt) {
			alert("请输入系列名称")
			e.preventDefault();
		} else if(!pdNomeIpt) {
			alert("请输入品类")
			e.preventDefault();
		} else if(!specfIpt) {
			alert("请输入产品规格")
			e.preventDefault();
		} else if(!materIpt) {
			alert("请输入材质")
			e.preventDefault();
		} else if(!craftIpt) {
			alert("请输入工艺/面料")
			e.preventDefault();
		} else if(quantIpt < 0) {
			alert("数量不能是负数")
			e.preventDefault();
		}
	})

	$(".changeImg").click(function(e) {
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