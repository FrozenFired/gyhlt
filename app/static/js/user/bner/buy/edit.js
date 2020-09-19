$(function() {
	$("#buyAddForm").submit(function(e) {
		let strmup = $("#strmupIpt").val();
		let brand = $("#brandIpt").val();
		let discount = $("#discountIpt").val();
		if(!strmup || strmup.length < 20){
			alert("请选择供应商!")
			e.preventDefault();
		} else if(!brand || brand.length < 20){
			alert("请选择品牌!")
			e.preventDefault();
		} else if(!discount || discount.length < 2) {
			alert("请输入折扣!")
			e.preventDefault();
		}
	})

	$("#buyUpdForm").submit(function(e) {
		let discount = $("#discountIpt").val();
		if(!discount || discount.length < 2) {
			alert("请输入折扣!")
			e.preventDefault();
		}
	})
})