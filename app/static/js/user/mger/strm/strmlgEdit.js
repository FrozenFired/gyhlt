$(function() {
	$("#codeIpt").blur(function(e) {
		let code = $("#codeIpt").val();
		if(!code || code.length < 2){
			alert('请输入正确的物流公司编号');
		}
	})
	$("#nomeIpt").blur(function(e) {
		let nome = $("#nomeIpt").val();
		if(!nome || nome.length < 2){
			alert('请输入正确的物流公司名称');
		}
	})

	$("#objForm").submit(function(e) {
		let code = $("#codeIpt").val();
		let nome = $("#nomeIpt").val();

		if(!code || code.length < 2){
			alert('请输入正确的物流公司编号');
			e.preventDefault();
		} else if(!nome || nome.length < 2){
			alert('请输入正确的物流公司名称');
			e.preventDefault();
		}
	})
})