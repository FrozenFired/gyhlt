$(function() {
	$("#sellAddForm").submit(function(e) {
		let strmdw = $("#strmdwIpt").val();
		let brand = $("#brandIpt").val();
		let discount = $("#discountIpt").val();
		if(!strmdw || strmdw.length < 20){
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

	$("#sellUpdForm").submit(function(e) {
		let discount = $("#discountIpt").val();
		if(!discount || discount.length < 2) {
			alert("请输入折扣!")
			e.preventDefault();
		}
	})
})