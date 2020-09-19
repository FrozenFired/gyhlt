$(function() {
	// $(".header-box").on('input', '.headPdCode', function(e) {
	// 	let str = $(this).val().replace(/\s+/g,"").toUpperCase();
	// 	console.log(str)
	// })
	$(".headSearch").click(function(e) {
		let iptClass = $(this).attr("id");
		let keyword = $('.'+iptClass).val().replace(/\s+/g,"").toUpperCase();
		window.location.href = "/pdsecs?keyword="+keyword;
	})
	$(".headPdCode").blur(function(e) {
		let keyword = $(this).val().replace(/\s+/g,"").toUpperCase();
		window.location.href = "/pdsecs?keyword="+keyword;
	})
})