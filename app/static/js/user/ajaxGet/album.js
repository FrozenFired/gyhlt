var page = 0;
var count;
var isMore;
var getAlbums = (urlQuery, elemId, isReload, role) => {
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
					let albums = results.data.albums;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#albumCount").text(count)
					albumsRender(albums, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
};

var albumsRender = (albumsOption, elemId, isReload, role) => {
	let elem = '<div class="albumsElem">'
		for(let i=0; i<albumsOption.length; i++) {
			let album = albumsOption[i];
			elem += albumRender(album, role)
		}
	elem += '</div>'
	$(".moreAlbum").remove();
	// if(isMore == 1) {
	// 	elem += '<div class="text-center moreAlbum my-3">'
	// 		elem += '<button class="btn btn-default btn-block moreAlbum" type="button">'
	// 		elem += ' 更多 </button>'
	// 	elem += '</div>'
	// }
	if(isReload == 1) $(".albumsElem").remove();
	if(!elemId) elemId = "#albumsElem"
	$(elemId).append(elem);
}
var albumRender = (album, role) => {
	let elem = '';
	elem += '<div class="row mt-2 py-2 bg-secondary albumCard">'
		elem += '<div class="col-4">'
				elem += '<div class="brand">'+album.brand.nome+'</div>'
				elem += '<br>'
				elem += '<div class="year">'+album.year+'年</div>'
		elem += '</div>'
		elem += '<div class="col-4">'
			elem += '<a href="/'+role+'Album/'+album._id+'">'
				elem += '<div class="text-info text-center">'+album.nome+'</div>'
			elem += '</a>'
		elem += '</div>'
		elem += '<div class="col-4 text-right">'
			elem += '<a class="text-warning" href='+album.pdf+' target="_blank">'
				let photo = '/upload/album/1.jpg';
				if(album.photo) photo = album.photo;
				elem += '<img src="'+photo+'" width="100px">'
			elem += '</a>'
		elem += '</div>'
	elem += '</div>'
	return elem;
}