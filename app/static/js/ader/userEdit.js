$(function() {
	$("#userForm").submit(function(e) {
		let code = $("#codeIpt").val();
		let pwd = $("#pwdIpt").val();
		let firm = $("#firmIpt").val();
		if(!code || code.length < 2){
			alert('请输入正确的用户账号');
			e.preventDefault();
		} else if(!pwd || pwd.length < 1) {
			alert('请输入密码');
			e.preventDefault();
		} else if(!firm || firm.length < 20) {
			alert('请选择公司');
			e.preventDefault();
		}
	})
})