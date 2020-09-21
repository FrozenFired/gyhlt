let brands;
let pdfirs;
let pdsecs;
let pdthds;
$(function() {
	// $("#objectForm").submit(function(e) {
	// 	let brandIpt = $("#brandIpt").val();
	// 	let brandNomeIpt = $("#brandNomeIpt").val();
	// 	if(!brandIpt && !brandNomeIpt) {
	// 		alert("请输入品牌")
	// 		e.preventDefault();
	// 	}

	// 	let status = $("input[name='obj[status]']:checked").val();
	// 	if(status == Conf.status.done.num) {
	// 		let pdfirIpt = $("#pdfirIpt").val();
	// 		let pdsecIpt = $("#pdsecIpt").val();
	// 		let pdthdIpt = $("#pdthdIpt").val();
	// 		if(!brandIpt || brandIpt.length < 20) {
	// 			alert("请完善[品牌]数据库数据, 并同步到此处")
	// 			e.preventDefault();
	// 		} else if(!pdfirIpt || pdfirIpt.length < 20) {
	// 			alert("请完善[系列]数据库数据, 并同步到此处")
	// 			e.preventDefault();
	// 		} else if(!pdsecIpt || pdsecIpt.length < 20) {
	// 			alert("请完善[产品]数据库数据, 并同步到此处")
	// 			e.preventDefault();
	// 		} else if(!pdthdIpt || pdthdIpt.length < 20) {
	// 			alert("请完善[商品]数据库数据, 并同步到此处")
	// 			e.preventDefault();
	// 		}
	// 	}
	// })


	/*   数据初始化  */
	funcInit = () => {
		let brandFilter = $("#brandFilterAjax").val();
		if(brandFilter) {
			brandParam = brandFilter.split('@')[0];
			brandElemId = brandFilter.split('@')[1];
		}

		let pdfirFilter = $("#pdfirFilterAjax").val();
		if(pdfirFilter) {
			pdfirParam = pdfirFilter.split('@')[0];
			pdfirElemId = pdfirFilter.split('@')[1];
		}

		let pdsecFilter = $("#pdsecFilterAjax").val();
		if(pdsecFilter) {
			pdsecParam = pdsecFilter.split('@')[0];
			pdsecElemId = pdsecFilter.split('@')[1];
		}

		let pdthdFilter = $("#pdthdFilterAjax").val();
		if(pdthdFilter) {
			pdthdParam = pdthdFilter.split('@')[0];
			pdthdElemId = pdthdFilter.split('@')[1];
		}
	}
	funcInit();

	/* ======================== 品牌选择 ======================== */
	$("#brandNomeIpt").focus(function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		brandNomeIptFunc(keyword)
	})
	$("#brandNomeIpt").blur(function(e) {
		let brandIpt = $("#brandIpt").val();
		if(brandIpt && brandIpt.length > 20) {
			$(".brandsElem").remove();
		}
	})
	$("#objectForm").on('input', '#brandNomeIpt', function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

		$("#brandIpt").val('')

		$("#pdfirIpt").val('')
		$("#firNomeIpt").val('')
		$(".firImg").remove();

		$("#pdsecIpt").val('')
		$("#specfIpt").val('')
		$("#secNomeIpt").val('')
		$(".secImg").remove();

		$("#pdthdIpt").val('')
		$("#thdNomeIpt").val('')
		$("#materIpt").val('')
		$("#craftIpt").val('')

		brandNomeIptFunc(keyword)
	})
	var brandNomeIptFunc = function(keyword) {
		$(".ajax").hide();
		$("#brandsElem").show();

		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "&keyword=" + 'null';
		}
		urlBrand = brandParam + keyword;
		$.ajax({
			type: "GET",
			url: urlBrand,
			success: function(results) {
				if(results.status === 1) {
					brands = results.data.brands;
					brandsRender(brands, brandElemId)
				} else if(results.status === 0) {
					alert(results.msg);
				}
			}
		});

	}
	$("#brandsElem").on('click', '.brandCard', function(e) {
		$(".ajax").hide();
		let brandId = $(this).attr("id").split("-")[1]
		let brand;
		for(let i=0; i<brands.length; i++) {
			if(String(brands[i]._id) == brandId) {
				brand = brands[i];
				break;
			}
		}
		$("#brandIpt").val(brandId)
		$("#brandNomeIpt").val(brand.nome)
	})

	/* ======================== 系列选择 ======================== */
	$("#firNomeIpt").focus(function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		firNomeIptFunc(keyword)
	})
	$("#firNomeIpt").blur(function(e) {
		let pdfirIpt = $("#pdfirIpt").val();
		if(pdfirIpt && pdfirIpt.length > 20) {
			$(".pdfirsElem").remove();
		}
	})
	$("#objectForm").on('input', '#firNomeIpt', function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

		$("#pdfirIpt").val('')
		$(".firImg").remove();

		$("#pdsecIpt").val('')
		$("#specfIpt").val('')
		$("#secNomeIpt").val('')
		$(".secImg").remove();

		$("#pdthdIpt").val('')
		$("#thdNomeIpt").val('')
		$("#materIpt").val('')
		$("#craftIpt").val('')

		firNomeIptFunc(keyword)
	})
	let firNomeIptFunc = function(keyword) {
		$(".ajax").hide();
		$("#pdfirsElem").show();

		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		}
		let brandId = $("#brandIpt").val();
		if(brandId && brandId.length > 20) {
			brandCond = "&brandId=" + brandId
			urlPdfir = pdfirParam + brandCond + keyword;
			$.ajax({
				type: "GET",
				url: urlPdfir,
				success: function(results) {
					if(results.status === 1) {
						pdfirs = results.data.pdfirs;
						pdfirsRender(pdfirs, pdfirElemId)
					} else if(results.status === 0) {
						alert(results.msg);
					}
				}
			});
		}
	}
	$("#pdfirsElem").on('click', '.pdfirCard', function(e) {
		$(".ajax").hide();
		let pdfirId = $(this).attr("id").split("-")[1]
		let pdfir;
		for(let i=0; i<pdfirs.length; i++) {
			if(String(pdfirs[i]._id) == pdfirId) {
				pdfir = pdfirs[i];
				break;
			}
		}
		$("#pdfirIpt").val(pdfirId)
		$("#firNomeIpt").val(pdfir.code)
		let elem = '<div class="firImg text-right">'
			elem += '<img src="'+pdfir.photo+'", width="120px">'
			elem += '<a href="'+pdfir.photo+'" target="_blank"><span class="oi oi-magnifying-glass"></span></a>'
		elem += '</div>'
		$("#firImg").append(elem)
	})

	/* ======================== 产品选择 ======================== */
	$("#secNomeIpt").focus(function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		secNomeIptFunc(keyword)
	})
	$("#secNomeIpt").blur(function(e) {
		let pdsecIpt = $("#pdsecIpt").val();
		if(pdsecIpt && pdsecIpt.length > 20) {
			$(".pdsecsElem").remove();
		}
	})
	$("#objectForm").on('input', '#secNomeIpt', function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

		$("#pdsecIpt").val('')
		$("#specfIpt").val('')
		$(".secImg").remove();
		
		$("#pdthdIpt").val('')
		$("#thdNomeIpt").val('')
		$("#materIpt").val('')
		$("craftIpt").val('')

		secNomeIptFunc(keyword)
	})
	var secNomeIptFunc = function(keyword) {
		$(".ajax").hide();
		$("#pdsecsElem").show();

		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		}

		let brandId = $("#brandIpt").val();
		if(brandId && brandId.length > 20) {
			brandCond = "&brandId=" + brandId

			let pdfirId = $("#pdfirIpt").val();
			if(pdfirId && pdfirId.length > 20) {
				pdfirCond = "&pdfirId=" + pdfirId

				urlPdsec = pdsecParam + brandCond + pdfirCond + keyword;
				$.ajax({
					type: "GET",
					url: urlPdsec,
					success: function(results) {
						if(results.status === 1) {
							pdsecs = results.data.pdsecs;
							pdsecsRender(pdsecs, pdsecElemId)
						} else if(results.status === 0) {
							alert(results.msg);
						}
					}
				});
			}
		}
	}
	$("#pdsecsElem").on('click', '.pdsecCard', function(e) {
		$(".ajax").hide();
		let pdsecId = $(this).attr("id").split("-")[1]
		let pdsec;
		for(let i=0; i<pdsecs.length; i++) {
			if(String(pdsecs[i]._id) == pdsecId) {
				pdsec = pdsecs[i];
				break;
			}
		}
		$("#pdsecIpt").val(pdsecId)
		$("#specfIpt").val(pdsec.spec)
		$("#secNomeIpt").val(pdsec.code)
		let elem = '<div class="secImg text-right">'
			elem += '<img src="'+pdsec.photo+'", width="120px">'
			elem += '<a href="'+pdsec.photo+'" target="_blank"><span class="oi oi-magnifying-glass"></span></a>'
		elem += '</div>'
		$("#secImg").append(elem)
	})

	/* ======================== 具体商品选择 ======================== */
	$("#thdNomeIpt").focus(function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		thdNomeIptFunc(keyword)
	})
	$("#thdNomeIpt").blur(function(e) {
		let pdthdIpt = $("#pdthdIpt").val();
		if(pdthdIpt && pdthdIpt.length > 20) {
			$(".pdthdsElem").remove();
		}
	})
	$("#objectForm").on('input', '#thdNomeIpt', function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

		$("#pdthdIpt").val('')
		$("#materIpt").val('')
		$("#craftIpt").val('')

		thdNomeIptFunc(keyword)
	})
	var thdNomeIptFunc = function(keyword) {
		$(".ajax").hide();
		$("#pdthdsElem").show();

		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		}
		let brandId = $("#brandIpt").val();
		if(brandId && brandId.length > 20) {
			brandCond = "&brandId=" + brandId

			let pdfirId = $("#pdfirIpt").val();
			if(pdfirId && pdfirId.length > 20) {
				pdfirCond = "&pdfirId=" + pdfirId

				let pdsecId = $("#pdsecIpt").val();
				if(pdsecId && pdsecId.length > 20) {
					pdsecCond = "&pdsecId=" + pdsecId

					urlPdthd = pdthdParam + brandCond + pdfirCond  + pdsecCond + keyword;
					$.ajax({
						type: "GET",
						url: urlPdthd,
						success: function(results) {
							if(results.status === 1) {
								pdthds = results.data.pdthds;
								pdthdsRender(pdthds, pdthdElemId)
							} else if(results.status === 0) {
								alert(results.msg);
							}
						}
					});
				}
			}
		}

	}
	$("#pdthdsElem").on('click', '.pdthdCard', function(e) {
		$(".ajax").hide();
		let pdthdId = $(this).attr("id").split("-")[1]
		let pdthd;
		for(let i=0; i<pdthds.length; i++) {
			if(String(pdthds[i]._id) == pdthdId) {
				pdthd = pdthds[i];
				break;
			}
		}
		$("#pdthdIpt").val(pdthdId)
		$("#thdNomeIpt").val(pdthd.code)
		let mater = '';
		for(let i=0; i<pdthd.maters.length; i++) {
			if(pdthd.maters[i].length >0) {
				mater += '['+pdthd.maters[i] + '] ';
			}
		}
		$("#materIpt").val(mater)
		let craft = '';
		for(let i=0; i<pdthd.crafts.length; i++) {
			if(pdthd.crafts[i].length >0) {
				craft += '['+pdthd.crafts[i] + '] ';
			}
		}
		$("#craftIpt").val(craft)
	})

})

var brandsRender = (brandsOption, elemId) => {
	let elem = '<div class="row brandsElem">'
		for(let i=0; i<brandsOption.length; i++) {
			let brand = brandsOption[i];
			elem += brandRender(brand)
		}
	elem += '</div>'
	$(".brandsElem").remove();
	if(!elemId) elemId = "#brandsElem"
	$(elemId).append(elem);
}
var brandRender = (brand) => {
	let logo = brand.logo;
	if(!logo) logo = '/upload/brand/1.jpg';
	let elem = '';
	elem += '<div class="col-3 col-md-2 mt-2 brandCard" id="brandCard-'+brand._id+'">'
		elem += '<img class="border border-top-0" src="'+logo+'" width="100%" height="60px" '
		elem += 'style="object-fit: scale-down;">'
		elem += '<div class="text-info text-center">'+brand.nome+'</div>'
	elem += '</div>'
	return elem;
}

var pdfirsRender = (pdfirsOption, elemId) => {
	let elem = '<div class="row pdfirsElem">'
		for(let i=0; i<pdfirsOption.length; i++) {
			let pdfir = pdfirsOption[i];
			elem += pdfirRender(pdfir)
		}
	elem += '</div>'
	$(".pdfirsElem").remove();
	if(!elemId) elemId = "#pdfirsElem"
	$(elemId).append(elem);
}
var pdfirRender = (pdfir) => {
	let photo = pdfir.photo;
	if(!photo) photo = '/upload/pdfir/1.jpg';
	let elem = '';
	elem += '<div class="col-3 col-md-2 mt-2 pdfirCard" id="pdfirCard-'+pdfir._id+'">'
		elem += '<img class="border border-top-0" src="'+photo+'" width="100%" height="60px" '
		elem += 'style="object-fit: scale-down;">'
		elem += '<div class="text-dark text-center">['+pdfir.brand.nome+']</div>'
		elem += '<div class="text-info text-center">'+pdfir.code+'</div>'
	elem += '</div>'
	return elem;
}

var pdsecsRender = (pdsecsOption, elemId) => {
	let elem = '<div class="row pdsecsElem">'
		for(let i=0; i<pdsecsOption.length; i++) {
			let pdsec = pdsecsOption[i];
			elem += pdsecRender(pdsec)
		}
	elem += '</div>'
	$(".pdsecsElem").remove();
	if(!elemId) elemId = "#pdsecsElem"
	$(elemId).append(elem);
}
var pdsecRender = (pdsec) => {
	let photo = pdsec.photo;
	if(!photo) photo = '/upload/pdsec/1.jpg';
	let elem = '';
	elem += '<div class="col-3 col-md-2 mt-2 pdsecCard" id="pdsecCard-'+pdsec._id+'">'
		elem += '<img class="border border-top-0" src="'+photo+'" width="100%" height="60px" '
		elem += 'style="object-fit: scale-down;">'
		elem += '<div class="text-dark text-center">['+pdsec.pdfir.brand.nome+']</div>'
		elem += '<div class="text-dark text-center">['+pdsec.pdfir.code+']</div>'
		elem += '<div class="text-info text-center">'+pdsec.code+'</div>'
		elem += '<div class="text-info text-center">'+pdsec.spec+'</div>'
	elem += '</div>'
	return elem;
}

var pdthdsRender = (pdthdsOption, elemId) => {
	let elem = '<div class="row text-center mx-3 pdthdsElem">'
		for(let i=0; i<pdthdsOption.length; i++) {
			let pdthd = pdthdsOption[i];
			elem += pdthdRender(pdthd)
		}
	elem += '</div>'
	$(".pdthdsElem").remove();
	if(!elemId) elemId = "#pdthdsElem"
	$(elemId).append(elem);
}
var pdthdRender = (pdthd) => {
	let photo = pdthd.photo;
	if(!photo) photo = '/upload/pdthd/1.jpg';
	let elem = '';
	elem += '<div class="col-3 col-md-2 mt-2 p-3 border pdthdCard" id="pdthdCard-'+pdthd._id+'">'
		// elem += '<div class="text-dark text-center">['+pdthd.pdsec.pdfir.brand.nome+']</div>'
		// elem += '<div class="text-dark text-center">['+pdthd.pdsec.pdfir.nome+']</div>'
		// elem += '<div class="text-dark text-center">['+pdthd.pdsec.code+']</div>'
		elem += '<div class="text-info text-center">'+pdthd.code+'</div>'
		for(let i=0; i<pdthd.maters.length; i++) {
			let mater = pdthd.maters[i]
			elem += '<div class="text-dark mt-2">'+mater+'</div>'
		}
	elem += '</div>'
	return elem;
}