$(function() {
	// $("#categIpt").change((e) => {
	// 	let type = $("#categIpt").val();
	// 	console.log(type)
	// })
	$("#firmForm").submit(function(e) {
		let code = $("#codeIpt").val();
		let type = $("#categIpt").val();
		if(!code || code.length != Conf.codeLenFirm){
			alert('公司编号长度必须为 3');
			e.preventDefault();
		} else if(isNaN(type) || type < 0 || type >3) {
			alert('请选择公司类型');
			e.preventDefault();
		}
	})
})