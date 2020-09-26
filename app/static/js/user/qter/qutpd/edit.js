$(() => {
	var isDelNotFunc = function() {
		let qntpdSts = $("input[name='obj[qntpdSts]']:checked").val();
		if(qntpdSts == Conf.status.del.num) {
			$(".delNoteRow").show();
		} else {
			$(".delNoteRow").hide();
		}
	}
	isDelNotFunc();
	$("input[name='obj[qntpdSts]']").change(function(e) {
		isDelNotFunc();
	})


	/* ======== 询价单下的商品添加页面的切换 ======*/
	$("#qutpdAddPageShow").click((e) => {
		$("#qutpdsPage").hide();
		$("#qutpdAddPage").show();
	})
	$("#qutpdsPageShow").click((e) => {	// 取消添加
		$("#qutpdAddPage").hide();
		$("#qutpdsPage").show();
	})

	$("#objectForm").submit(function(e) {
		let brandNomeIpt = $("#brandNomeIpt").val();
		let firNomeIpt = $("#firNomeIpt").val();
		let specfIpt = $("#specfIpt").val();
		let materIpt = $("#materIpt").val();
		if(!brandNomeIpt) {
			alert("请输入品牌")
			e.preventDefault();
		} else if(!firNomeIpt) {
			alert("请输入系列名称")
			e.preventDefault();
		} else if(!specfIpt) {
			alert("请输入产品规格")
			e.preventDefault();
		} else if(!materIpt) {
			alert("请输入材质")
			e.preventDefault();
		}

		let qntpdSts = $("input[name='obj[qntpdSts]']:checked").val();
		if(qntpdSts == Conf.status.done.num) {
			let pdfirIpt = $("#pdfirIpt").val();
			let pdsecIpt = $("#pdsecIpt").val();
			let pdthdIpt = $("#pdthdIpt").val();
			if(!brandIpt || brandIpt.length < 20) {
				alert("请完善[品牌]数据库数据, 并同步到此处")
				e.preventDefault();
			} else if(!pdfirIpt || pdfirIpt.length < 20) {
				alert("请完善[系列]数据库数据, 并同步到此处")
				e.preventDefault();
			} else if(!pdsecIpt || pdsecIpt.length < 20) {
				alert("请完善[产品]数据库数据, 并同步到此处")
				e.preventDefault();
			} else if(!pdthdIpt || pdthdIpt.length < 20) {
				alert("请完善[商品]数据库数据, 并同步到此处")
				e.preventDefault();
			}
		} else if(qntpdSts == Conf.status.del.num) {
			let delNoteIpt = $("#delNoteIpt").val();
			if(!delNoteIpt || delNoteIpt.length < 3) {
				alert("请说明删除原因")
				e.preventDefault();
			}
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