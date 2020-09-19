$(function() {
	$("#commentSubmitBtn").click(function(e) {
		let contentIpt = $("#contentIpt").val();
		if(contentIpt && contentIpt.length > 0) {
			let target = $(e.target)
			let id = target.data('id')
			let form = $("#commentForm");
			let data = form.serialize();
			let url = form.attr('action');

			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						// location.reload();
						comment = results.data.comment;
						// console.log(comment)
						let elem = '';
						elem += commentRender(comment, role)
						let elemId = commentElemId;
						if(!elemId) elemId = "#commentsElem"
						$(elemId).prepend(elem);
						$("#contentIpt").val('');
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			alert("请输入留言内容")
		}
	})

	$(commentElemId).on('click', '.submitButton', function(e) {
		var target = $(this)
		var id = target.data('id')
		var mark = target.data('mark')
		let form = $("#commentForm-"+id);
		let contentIpt = $("#contentIpt-"+id);

		if(mark || mark == 0) {
			form = $("#commentForm2-"+id+mark);
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
						comment = results.data.comment;
						reply = results.data.reply;
						// console.log(comment)
						let elem = '';
						elem += replyRender(comment, reply, role)
						let elemId = "#allReply-"+comment._id
						$(elemId).prepend(elem);

						/* === 隐藏一级评论回复框 === */
						$('#replyButton-'+id).show()
						$('#cancelButton-'+id).hide()
						$('#commentForm-' + id).hide()

						$('#reply-' + id).find($('.hideReply')).show()
						$('#reply-' + id).find($('.showReply')).hide()
						$('#allReply-' + id).show()

						$('#commentForm2-' + id+mark).hide()

						$("#reply-"+id).show();
						$("#replysNum-"+id).text(comment.replys.length)
						contentIpt.val('')
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		}
	})
});