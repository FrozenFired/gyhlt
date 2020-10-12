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
})