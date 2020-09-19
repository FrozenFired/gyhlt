var page = 0;
var count;
var isMore;
var getBrands = (urlQuery, elemId, isReload, role) => {
	// console.log(urlQuery)
	// console.log(elemId)
	// console.log(isReload)
	// console.log(role)

	$.ajax({
		type: "GET",
		url: urlQuery,
		success: function(results) {
			if(results.status === 1) {
				if(page+1 != results.data.page) {
					// 如果数据错误 则不输出
				} else {
					let brands = results.data.brands;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#brandCount").text(count)
					brandsRender(brands, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
};

var brandsRender = (brandsOption, elemId, isReload, role) => {
	let elem = '<div class="row brandsElem">'
		for(let i=0; i<brandsOption.length; i++) {
			let brand = brandsOption[i];
			elem += brandRender(brand, role)
		}
	elem += '</div>'
	$(".moreBrand").remove();
	// if(isMore == 1) {
	// 	elem += '<div class="text-center moreBrand my-3">'
	// 		elem += '<button class="btn btn-default btn-block moreBrand" type="button">'
	// 		elem += ' 更多 </button>'
	// 	elem += '</div>'
	// }
	if(isReload == 1) $(".brandsElem").remove();
	if(!elemId) elemId = "#brandsElem"
	$(elemId).append(elem);
}
var brandRender = (brand, role) => {
	let shelfBg = 'bg-default';
	if(brand.shelf == 0) {
		shelfBg = 'bg-secondary';
	} else if(brand.shelf == 2) {
		shelfBg = 'bg-warning';
	}

	let logo = brand.logo;
	if(!logo) logo = '/upload/brand/1.jpg';
	let elem = '';
	elem += '<div class="col-6 col-lg-4 mt-2 brandCard">'
		elem += '<a href="/'+role+'Brand/'+brand._id+'">'
			elem += '<img class="border border-top-0" src="'+logo+'" width="100%" height="120px" style="object-fit: scale-down;">'
		elem += '</a>'
		if(role != 'ct') {
			elem += '<div class="text-info text-center '+shelfBg+'">'+brand.nome+' ['+brand.weight+']</div>'
		}
	elem += '</div>'
	return elem;
}