$(function() {
	$("#brandSel").change(function(e) {
		var selBrand = $(this).val();
		var selSts = $("input[type='radio'][name=qntpdSts]:checked").val();
		trFilter(selBrand, selSts)
	})

	$('input[type=radio][name=qntpdSts]').change(function() {
		var selSts = $(this).val();
		var selBrand = $("#brandSel").find("option:selected").val();
		trFilter(selBrand, selSts)
	});
	var initFilter = function() {
		var selBrand = $("#brandSel").find("option:selected").val();
		var selSts = $("input[type='radio'][name=qntpdSts]:checked").val();
	}

	var trFilter = function(selBrand, selSts) {
		$(".pdTr").each(function(index,elem) {
			if(!selBrand || selBrand == '全部品牌' || selBrand == $(this).attr("pdbrand")) {
				if(!selSts || selSts == '全部' || selSts == $(this).attr("pdSts")) {
					$(this).show();
				} else {
					$(this).hide();
				}
			}else {
				$(this).hide();
			}
		})
	}
})