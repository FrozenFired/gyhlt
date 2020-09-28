$(function() {
	$("#nomeIpt").blur(function(e) {
		let nome = $("#nomeIpt").val();
		if(!nome || nome.length < 2){
			alert('请输入正确的供应商名称');
		}
	})

	$("#strmdwAddForm").submit(function(e) {
		let nome = $("#nomeIpt").val();

		if(!nome || nome.length < 2){
			alert('请输入正确的供应商名称');
			e.preventDefault();
		}
	})
})