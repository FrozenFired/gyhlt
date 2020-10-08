$(function() {
	$("#notifySubmitBtn").click(function(e) {
		let contentIpt = $("#contentIpt").val();
		if(contentIpt && contentIpt.length > 0) {
			let target = $(e.target)
			let id = target.data('id')
			let form = $("#notifyForm");
			let data = form.serialize();
			let url = form.attr('action');

			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						// location.reload();
						notify = results.data.notify;
						// console.log(notify)
						let elem = '';
						elem += notifyRender(notify, role)
						let elemId = notifyElemId;
						if(!elemId) elemId = "#notifysElem"
						$(elemId).prepend(elem);
						$("#contentIpt").val('');
						getNotifysHeader(); 	// 留言通知
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			alert("请输入留言内容")
		}
	})

	$(notifyElemId).on('click', '.submitButton', function(e) {
		var target = $(this)
		var id = target.data('id')
		var mark = target.data('mark')
		let form = $("#notifyForm-"+id);
		let contentIpt = $("#contentIpt-"+id);

		if(mark || mark == 0) {
			form = $("#notifyForm2-"+id+mark);
			contentIpt = $("#contentIpt-"+id+mark);
		}
		let content = contentIpt.val();
		if(!content || content.length < 1) {
			alert("请输入回复内容")
		} else {
			let data = form.serialize();
			let url = form.attr('action');
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						notify = results.data.notify;
						reply = results.data.reply;
						// console.log(notify)
						let elem = '';
						elem += replyRender(notify, reply, role)
						let elemId = "#allReply-"+notify._id
						$(elemId).prepend(elem);

						/* === 隐藏一级评论回复框 === */
						$('#replyButton-'+id).show()
						$('#cancelButton-'+id).hide()
						$('#notifyForm-' + id).hide()

						$('#reply-' + id).find($('.hideReply')).show()
						$('#reply-' + id).find($('.showReply')).hide()
						$('#allReply-' + id).show()

						$('#notifyForm2-' + id+mark).hide()

						$("#reply-"+id).show();
						$("#replysNum-"+id).text(notify.replys.length)
						contentIpt.val('')
						getNotifysHeader(); 	// 留言通知
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		}
	})
});