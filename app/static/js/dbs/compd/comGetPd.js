// 询报价单 添加商品
let brands;
let pdfirs;
let pdsecs;
let pdthds;
let priceShow = "";
$(function() {
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
			priceShow = pdthdFilter.split('@')[2];
		}
	}
	funcInit();

	/* ======================== 品牌选择 ======================== */
	$("#brandNomeIpt").focus(function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		brandNomeIptFunc(keyword)
	})
	$("#brandNomeIpt").blur(function(e) {
		let brandNomePre = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		setTimeout(function(){
			let brandNome = $("#brandNomeIpt").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			if(brandNome == brandNomePre) {
				let brand = null;
				for(let i=0; i<brands.length; i++) {
					if(String(brands[i].nome) == brandNome) {
						brand = brands[i];
						break;
					}
				}
				if(brand) {
					brandElemFunc(brand)
				}
			} else {
				// $(".brandweb").remove();
			}
		}, 300);
	})
	$("#objectForm").on('input', '#brandNomeIpt', function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

		let brandIpt = $("#brandIpt").val();
		if(brandIpt && brandIpt.length > 20) {
			$("#brandIpt").val('');
			$(".brandweb").remove();
		}
		// 如果本数据库中的数据 那么当上级更改时, 这个就不会存在
		let pdfirIpt = $("#pdfirIpt").val();
		if(pdfirIpt && pdfirIpt.length > 20) {
			$("#pdfirIpt").val('')
			$("#firNomeIpt").val('')
			$(".firImg").remove();
			$(".firImgs").remove();
			$("#firphotoIpt").val('');
		}

		let pdsecIpt = $("#pdsecIpt").val();
		if(pdsecIpt && pdsecIpt.length > 20) {
			$("#pdsecIpt").val('')
			$("#specfIpt").val('')
			$("#secNomeIpt").val('')
			$(".secImg").remove();
		}

		let pdthdIpt = $("#pdthdIpt").val();
		if(pdthdIpt && pdthdIpt.length > 20) {
			$("#pdthdIpt").val('')
			$("#thdNomeIpt").val('')
			$("#materIpt").val('')
			$("#craftIpt").val('')
		}

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
		brandElemFunc(brand)
	})
	var brandElemFunc = function(brand) {
		$(".brandCard").hide();
		$("#brandIpt").val(brand._id)
		$("#brandNomeIpt").val(brand.nome)
		if(brand.website) {
			let website = brand.website;
			if(website && website.slice(0,4) != 'http') {
				website = 'http://'+website
			}
			let elem = '<div class="brandweb">'
				elem += '<a href="'+website+'" target="_blank">'+brand.nome+'官网</a>'
			elem += '</div>';
			console.log(1)
			$(".brandweb").remove();
			$("#brandweb").append(elem)
			console.log(2)
		}
	}

	/* ======================== 系列选择 ======================== */
	$("#firNomeIpt").focus(function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		firNomeIptFunc(keyword)
	})
	$("#firNomeIpt").blur(function(e) {
		let firCodePre = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		setTimeout(function(){
			let firCode = $("#firNomeIpt").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			if(firCode == firCodePre) {
				let pdfir = null;
				for(let i=0; i<pdfirs.length; i++) {
					if(String(pdfirs[i].code) == firCode) {
						pdfir = pdfirs[i];
						break;
					}
				}
				if(pdfir) {
					pdfirElemFunc(pdfir)
				}
			} else {
				// $(".firImgs").remove();
			}
		}, 300)
	})
	$("#objectForm").on('input', '#firNomeIpt', function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

		let pdfirIpt = $("#pdfirIpt").val();
		if(pdfirIpt && pdfirIpt.length > 20) {
			$("#pdfirIpt").val('')
			$(".firImg").remove();
			$(".firImgs").remove();
			$("#firphotoIpt").val('');
		}

		let pdsecIpt = $("#pdsecIpt").val();
		if(pdsecIpt && pdsecIpt.length > 20) {
			$("#pdsecIpt").val('')
			$("#specfIpt").val('')
			$("#secNomeIpt").val('')
			$(".secImg").remove();
		}

		let pdthdIpt = $("#pdthdIpt").val();
		if(pdthdIpt && pdthdIpt.length > 20) {
			$("#pdthdIpt").val('')
			$("#thdNomeIpt").val('')
			$("#materIpt").val('')
			$("#craftIpt").val('')
		}

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
		pdfirElemFunc(pdfir)
	})
	var pdfirElemFunc = function(pdfir) {
		$(".pdfirCard").hide();
		$("#pdfirIpt").val(pdfir._id)
		$("#firNomeIpt").val(pdfir.code)
		let elem = '<div class="firImg text-right">'
			let firphoto = pdfir.photo;
			elem += '<img class="thumbnailImg"  src="'+firphoto+'", width="120px">'
		elem += '</div>'
		$(".firImg").remove()
		$("#firImg").append(elem)
		$("#firphotoIpt").val(firphoto)

		elem = '<div class="firImgs row text-right">'
			let selphoto = pdfir.photo;
			if(selphoto && selphoto.length > 4) {
				elem += '<div class="col-6 text-center mt-2">'
					elem += '<img class="thumbnailImg" id="thumbnailImg-hlt-i-hlt-'+selphoto+'" src="'+selphoto+'", width="120px">'
					elem += '<div class="photoSel text-info" id="photoSel-hlt-i-hlt-'+selphoto+'"><span class="oi oi-check"></span></div>'
				elem += '</div>'
			}
			for(let i=0; i<pdfir.photos.length; i++) {
				selphoto = pdfir.photos[i];
				if(selphoto && selphoto.length > 4) {
					elem += '<div class="col-6 text-center mt-2">'
						elem += '<img class="thumbnailImg" id="thumbnailImg-hlt-i-hlt-'+selphoto+'" src="'+selphoto+'", width="120px">'
						elem += '<div class="photoSel text-info" id="photoSel-hlt-'+i+'-hlt-'+selphoto+'"><span class="oi oi-check"></span></div>'
					elem += '</div>'
				}
			}
		elem += '</div>'
		$("#firImgs").show();
		$(".firImgs").remove();
		$("#firImgs").append(elem)
	}
	/* ======================== 系列的图片选择 ======================== */
	$("#firImgs").on('click', '.photoSel', function(e) {
		let firphoto = $(this).attr('id').split('-hlt-')[2];
		$(".firImg").remove();
		let elem = '<div class="firImg text-right">'
			elem += '<img class="thumbnailImg" src="'+firphoto+'", width="120px">'
		elem += '</div>'
		$("#firImg").append(elem)
		$("#firphotoIpt").val(firphoto)

		$("#firImgs").hide();
		$("#selPhotos").show();
	})
	$("#selPhotos").click(function(e) {
		$("#firImgs").show();
		$("#selPhotos").hide();
	})

	/* ======================== 产品选择 ======================== */
	$("#secNomeIpt").focus(function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		secNomeIptFunc(keyword)
	})
	$("#secNomeIpt").blur(function(e) {
		let secCodePre = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		setTimeout(function(){
			let secCode = $("#secNomeIpt").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			if(secCode == secCodePre) {
				let pdsec = null;
				for(let i=0; i<pdsecs.length; i++) {
					if(String(pdsecs[i].code) == secCodePre) {
						pdsec = pdsecs[i];
						break;
					}
				}
				if(pdsec) {
					pdsecElemFunc(pdsec)
				}
			}
		}, 300);
	})
	$("#objectForm").on('input', '#secNomeIpt', function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

		let pdsecIpt = $("#pdsecIpt").val();
		if(pdsecIpt && pdsecIpt.length > 20) {
			$("#pdsecIpt").val('')
			$("#specfIpt").val('')
			$(".secImg").remove();
		}

		let pdthdIpt = $("#pdthdIpt").val();
		if(pdthdIpt && pdthdIpt.length > 20) {
			$("#pdthdIpt").val('')
			$("#thdNomeIpt").val('')
			$("#materIpt").val('')
			$("craftIpt").val('')
		}

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
		pdsecElemFunc(pdsec)
	})
	var pdsecElemFunc = function(pdsec) {
		$(".pdsecCard").hide()
		$("#pdsecIpt").val(pdsec._id)
		$("#specfIpt").val(pdsec.spec)
		$("#secNomeIpt").val(pdsec.code)
		let elem = '<div class="secImg text-right">'
			elem += '<img class="thumbnailImg" src="'+pdsec.photo+'", width="120px">'
		elem += '</div>'
		$(".secImg").remove();
		$("#secImg").append(elem)
	}

	/* ======================== 具体商品选择 ======================== */
	$("#thdNomeIpt").focus(function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		thdNomeIptFunc(keyword)
	})
	$("#thdNomeIpt").blur(function(e) {
		let thdCodePre = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		setTimeout(function(){
			let thdCode = $("#thdNomeIpt").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			if(thdCode == thdCodePre) {
				let pdthd = null;
				for(let i=0; i<pdthds.length; i++) {
					if(String(pdthds[i].code) == thdCode) {
						pdthd = pdthds[i];
						break;
					}
				}
				if(pdthd) {
					pdthdElemFunc(pdthd)
				}
			}
		}, 300);
	})
	$("#objectForm").on('input', '#thdNomeIpt', function(e) {
		let keyword = $(this).val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

		let pdthdIpt = $("#pdthdIpt").val();
		if(pdthdIpt && pdthdIpt.length > 20) {
			$("#pdthdIpt").val('')
			$("#materIpt").val('')
			$("#craftIpt").val('')
		}

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
		pdthdElemFunc(pdthd)
	})
	var pdthdElemFunc = function(pdthd) {
		$(".pdthdCard").hide();
		$("#pdthdIpt").val(pdthd._id)
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
	}
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
	elem += '<div class="col-6 col-md-3 mt-2 p-3 border pdthdCard" id="pdthdCard-'+pdthd._id+'">'
		elem += '<div class="text-info text-center">'+pdthd.code+'</div>'
		if(priceShow == "priceShow") {
			elem += '<div class="text-info text-center">'+pdthd.price+' €</div>'
		}
		for(let i=0; i<pdthd.maters.length; i++) {
			if(i>2) break;
			let mater = pdthd.maters[i]
			let craft = pdthd.crafts[i]
			if(!mater && !craft) continue;
			elem += '<div class="row">'
				elem += '<div class="col-4 border-top">'
					if(mater) {
						elem += '<div class="text-dark mt-2">'+mater+': </div>'
					}
				elem += '</div>'
				elem += '<div class="col-8 border-top">'
					if(craft) {
						elem += '<div class="text-dark mt-2">'+craft+'</div>'
					}
				elem += '</div>'
			elem += '</div>'
		}
		elem += '<div class="text-dark">'+pdthd.note+'</div>'
	elem += '</div>'
	return elem;
}