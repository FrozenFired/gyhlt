$( function() {
	/* ======== 一级评论回复框 ======== */
	$(notifyElemId).on('click', '.replyButton', function(e) {
		var target = $(this)
		var id = target.data('id')

		$('#replyButton-'+id).hide()
		$('#cancelButton-'+id).show()
		$('#notifyForm-' + id).show()
	})

	/* ======== 取消一级评论回复框 ======== */
	$(notifyElemId).on('click', '.cancelButton', function(e) {
		var target = $(this)
		var id = target.data('id')

		$('#replyButton-'+id).show()
		$('#cancelButton-'+id).hide()
		$('#notifyForm-' + id).hide()
	})

	/* ============= 显示隐藏 一级评论的回复展示 ================ */
	$(notifyElemId).on('click', '.showReply', function(e) {
		var target = $(this)
		var id = target.data('id')

		$('#reply-' + id).find($('.hideReply')).show()
		$('#reply-' + id).find($('.showReply')).hide()
		$('#allReply-' + id).show()
	})
	$(notifyElemId).on('click', '.hideReply', function(e) {
		var target = $(this)
		var id = target.data('id')

		$('#reply-' + id).find($('.hideReply')).hide()
		$('#reply-' + id).find($('.showReply')).show()
		$('#allReply-' + id).hide()
	})

	/* ============= 显示隐藏 二级评论的回复框 ================ */
	$(notifyElemId).on('click', '.replyButton2', function(e) {
		var target = $(this)
		var pos = target.data('pos')

		$('#notifyForm2-' + pos).show()
	})
	$(notifyElemId).on('click', '.cancelButton2', function(e) {
		var target = $(this)
		var pos = target.data('pos')

		$('#notifyForm2-' + pos).hide()
	})

	/* ============= 惦记按钮 标识已经收到信息 ================ */
	$(notifyElemId).on('click', '.readBtn', function(e) {
		var target = $(this)
		var id = target.data('id')

			$.ajax({
				type: 'get',
				url: '/usNotifyReadAjax/' + id
			})
			.done(function(results) {
				if(results.status === 1) {
					$("#readBtn-"+id).hide();
				} else {
					alert(0)
				}
			})
	})


	/* ============= 点赞功能 暂时不用 ================ */
	$('.supportC').click(function(e) {
		var target = $(this)
		var cid = target.data('cid')
		var user = target.data('user')
		var ctrl = target.data('ctrl')

		if(user){
			$.ajax({
				type: 'get',
				url: '/notifySupport?control=' + ctrl + '&cid=' + cid
			})
			.done(function(results) {
				if(results.status === 1) {
					var csupports = parseInt(results.csupports)
					var cdisSupports = parseInt(results.cdisSupports)
					$('.supCount-' + cid).text(csupports)
					$('.disCount-' + cid).text(cdisSupports)
				}
				if(results.status === 0){
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
