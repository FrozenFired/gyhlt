$( function() {
	$('.changeStsAjax').click(function(e) {
		var target = $(e.target);
		var url = target.data('url');
		var id = target.data('id');
		var oldStatus = target.data('stsf');
		var newStatus = target.data('stst');
		$.ajax({
			type: 'GET',
			url: url + '?id=' + id + '&newStatus=' + newStatus +'&oldStatus=' + oldStatus
		})
		.done(function(results) {
			if(results.status === 1) {
				// alert(results.info)
				location.reload();
			} else if(results.status === 0) {
				alert(results.msg)
			}
			// 不能把 alert(results.info) 提取出来
		})
	})
} );