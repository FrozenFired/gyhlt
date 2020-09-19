$(function() {
	/* ====== 初始加载 =====*/
	let albumParam = '';
	let albumElemId = '';
	let role = '';
	albumsInit = () => {
		let albumFilter = $("#albumFilterAjax").val();
		if(albumFilter) {
			albumParam = albumFilter.split('@')[0];
			albumElemId = albumFilter.split('@')[1];
			role = albumFilter.split('@')[2];
		}
		urlQuery = albumParam;
		getAlbums(urlQuery, albumElemId, 1, role);
	}
	albumsInit();

	/* ====== 品牌搜索加载 =====*/
	$("#albumSearch").blur((e) => {
		let keyword = $("#albumSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
		}
		urlQuery = albumParam + keyword;
		getAlbums(urlQuery, albumElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var windowHeight = $(this).height();
		var scrollHeight = $(document).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			// alert('page:'+page+' count:'+count)
			if(isMore == 1) {
				getAlbums(urlQuery+'&page='+(parseInt(page)+1), albumElemId, 0, role);
			}
		}
	});
})