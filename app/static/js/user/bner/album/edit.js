$(function() {
	$("#nomeIpt").blur(function(e) {
		$("#fileName").val($("#nomeIpt").val())
	})

	$("#addForm").submit(function(e) {
		if(document.getElementById('fileUpload').value == null || document.getElementById('fileUpload').value == "") {
			alert('请上传图册');
			e.preventDefault();
		} else {
			let brandId = $("#brandId").val();

			let nome = $("#nomeIpt").val();
			$("#fileName").val($("#nomeIpt").val())
			if(!brandId || brandId.length < 20) {
				alert('请选择品牌');
				e.preventDefault();
			} else if(!nome || nome.length < 1){
				alert('请输图册名称');
				e.preventDefault();
			}
		}
	})


	$("#addForm").on('input', "#brandIpt", function(e) {
		$("#brandId").val(" ");
		let str = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		$.ajax({
			type: "GET",
			url: "/usBrandsAjax?keyword="+str,
			success: function(results) {
				if(results.status === 1) {
					let brands = results.data.brands
					let elem = "";
					for(let i=0; i<brands.length; i++) {
						let brand = brands[i];
						let brandnome = brand.nome;
						if(brandnome && brandnome.length > 10) {
							brandnome = brandnome.slice(0, 8)+'...'
						}
						elem += '<div class="col-6 col-md-2 mt-2 brandBtnBox">'
							elem += '<button class="brandBtn btn btn-default" data-id="'+brand._id;
							elem += '" data-nome="'+brand.nome+'" type="button" title="'+brand.nome+'">'
							elem += brandnome + '</button>'
						elem += '</div>'
					}
					$(".brandBtnBox").remove();
					$("#brandShow").append(elem)
				} else if(results.status === 0) {
					alert(results.msg);
				}
			}
		});
	})
	$("#brandShow").on('click', '.brandBtn', function(e) {
		let target = $(e.target);
		let id = target.data('id');
		let nome = target.data('nome');
		$("#brandId").val(id);
		$("#brandIpt").val(nome);
		$("#nomeIpt").val(nome);
		$(".brandBtnBox").remove();
	})
})