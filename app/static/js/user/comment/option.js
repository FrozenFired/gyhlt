$( function() {
	/* ======== 一级评论回复框 ======== */
	$(commentElemId).on('click', '.replyButton', function(e) {
		var target = $(this)
		var id = target.data('id')

		$('#replyButton-'+id).hide()
		$('#cancelButton-'+id).show()
		$('#commentForm-' + id).show()
	})

	/* ======== 取消一级评论回复框 ======== */
	$(commentElemId).on('click', '.cancelButton', function(e) {
		var target = $(this)
		var id = target.data('id')

		$('#replyButton-'+id).show()
		$('#cancelButton-'+id).hide()
		$('#commentForm-' + id).hide()
	})

	/* ============= 显示隐藏 一级评论的回复展示 ================ */
	$(commentElemId).on('click', '.showReply', function(e) {
		var target = $(this)
		var id = target.data('id')

		$('#reply-' + id).find($('.hideReply')).show()
		$('#reply-' + id).find($('.showReply')).hide()
		$('#allReply-' + id).show()
	})
	$(commentElemId).on('click', '.hideReply', function(e) {
		var target = $(this)
		var id = target.data('id')

		$('#reply-' + id).find($('.hideReply')).hide()
		$('#reply-' + id).find($('.showReply')).show()
		$('#allReply-' + id).hide()
	})

	/* ============= 显示隐藏 二级评论的回复框 ================ */
	$(commentElemId).on('click', '.replyButton2', function(e) {
		var target = $(this)
		var pos = target.data('pos')

		$('#commentForm2-' + pos).show()
	})
	$(commentElemId).on('click', '.cancelButton2', function(e) {
		var target = $(this)
		var pos = target.data('pos')

		$('#commentForm2-' + pos).hide()
	})


	$('.supportC').click(function(e) {
		var target = $(this)
		var cid = target.data('cid')
		var user = target.data('user')
		var ctrl = target.data('ctrl')

		if(user){
			$.ajax({
				type: 'get',
				url: '/commentSupport?control=' + ctrl + '&cid=' + cid
			})
			.done(function(results) {
				if(results.success === 1) {
					var csupports = parseInt(results.csupports)
					var cdisSupports = parseInt(results.cdisSupports)
					$('.supCount-' + cid).text(csupports)
					$('.disCount-' + cid).text(cdisSupports)
				}
				if(results.success === 0){
					var sinfo = results.sinfo
					alert(sinfo)
				}
			})
			// if(ctrl == 1){
			// 	$('.supCount').text('1')
			// }else {
			// 	$('.disCount').text('1')
			// }
		}else {
			alert("您需要登陆才可以操作")
		}
	})
} );
