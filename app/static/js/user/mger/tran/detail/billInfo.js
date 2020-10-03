$(() => {
	/* ======== 询价单下的商品添加页面的切换 ======*/
	$("#billAddPageShow").click((e) => {
		$("#billsPage").hide();
		$("#billAddPage").show();
	})
	$("#billsPageShow").click((e) => {	// 取消添加
		$("#billAddPage").hide();
		$("#billsPage").show();
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
	
	$("#billForm").submit(function(e) {
		let billPrIpt = $("#billPrIpt").val();
		if(!billPrIpt) {
			alert("请输入首款数")
			e.preventDefault();
		} else if(isNaN(billPrIpt)) {
			alert("款项是数字")
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