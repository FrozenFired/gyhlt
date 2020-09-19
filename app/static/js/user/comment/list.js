var getComments = (urlQuery, elemId, role) => {
	// console.log(urlQuery)
	// console.log(elemId)
	// console.log(role)

	$.ajax({
		type: "GET",
		url: urlQuery,
		success: function(results) {
			if(results.status === 1) {
				comments = results.data.comments;
				commentsRender(comments, elemId, role)
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
};

var commentsRender = (commentsOption, elemId, role) => {
	let elem = '';
	for(let i=0; i<commentsOption.length; i++) {
		let comment = commentsOption[i];
			elem += commentRender(comment, role)
	}
	$(".commentsElem").remove();
	if(!elemId) elemId = "#commentsElem"
	$(elemId).append(elem);
}
var commentRender = (comment, role) => {
	let elem = '';
	elem += '<div class="media mt-4">'
	// elem += '<div class="media-left media-top p-3">'
	// 	elem += '<h3 class="text-center">'+(comment.mark+1)+':</h3>' 
	// elem += '</div>'
	elem += '<div class="media-right media-body pl-2">'
		ts = timeSpan(Date.parse(comment.ctAt));
		elem += '<h5>'+comment.from.code+' <small class="text-secondary">('+ts+')</small></h5>'
		elem += '<h6>'+comment.content+'</h6>' 
		elem += '<div id="replyform-'+comment._id+'">'
			elem += '<button class="btn btn-link replyButton" id="replyButton-'+comment._id
			elem += '" data-id="'+comment._id+'" type="button"> 回复 </button>'

			elem += '<form id="commentForm-'+comment._id+'" method="POST" action="/usCommentReplyAjax" style="display:none">'
				elem += '<input type="hidden" name="obj[to]" value="'+comment.from._id+'" />'
				elem += '<input type="hidden" name="obj[_id]" value="'+comment._id+'"/>'
				elem += '<div class="form-group row">'
					elem += '<textarea class="form-control" id="contentIpt-'+comment._id+'" name="obj[content]" row="3" '
					elem += 'placeholder="对 '+comment.from.code+' 回复："/>'
				elem += '</div>'
				elem += '<div class="form-group row">'
					elem += '<button class="btn btn-link cancelButton" id="cancelButton-'+comment._id
					elem += '" data-id="'+comment._id+'" type="button" style="display:none"> 取消 </button>'

					elem += '<button class="btn btn-primary submitButton" '
					elem += 'data-id="'+comment._id+'" type="button"> 回复 </button>'
				elem += '</div>'
			elem += '</form>'
		elem += '</div>'
		let display = 'none';
		if(comment.replys && comment.replys.length > 0) {
			display = 'block';
		}
		elem += '<div id="reply-'+comment._id+'" style="display:'+display+'">';
			elem += '<button class="btn btn-link showReply" data-id="'+comment._id+'" '
			elem += 'type="button"> 查看所有 <span id="replysNum-'+comment._id+'">'
			elem += comment.replys.length+ '</span>条回复</button>'

			elem += '<button class="btn btn-link hideReply" data-id="'+comment._id+'" '
			elem += 'type="button" style="display:none"> 隐藏所有回复</button>'
		elem += '</div>'
		elem += '<div class="ml-3" id="allReply-'+comment._id+'" style="display: none">'
			for(let i=0; i<comment.replys.length; i++) {
				elem += replyRender(comment, comment.replys[i]);
			}
		elem += '</div>'
	elem += '</div>'
	elem += '</div>'
	return elem;
}
var replyRender = (comment, reply, role) => {
	let elem = '';
	elem += '<div>'
		ts = timeSpan(Date.parse(reply.ctAt));
		elem += '<span>' + reply.from.code+': <small class="text-secondary">('+ts+')</small></span>'
	elem += '<button class="btn btn-link replyButton2" data-pos="'+comment._id
	elem += reply.mark+'" type="button"> 回复 </button>'
	elem += '</div>'
		elem += '<p> <span class="text-info"> @ '+reply.to.code+':  </span>&nbsp; '+ reply.content +'</p>'

	elem += '<form id="commentForm2-'+comment._id+reply.mark+'" method="POST" '
	elem += 'action="/usCommentReplyAjax", style="display:none">'
		// input(type="hidden", name="obj[" + point + "]", value=object._id)
		// input(type="hidden", name="obj[cid]", value=comment._id)
		elem += '<input type="hidden", name="obj[to]", value="'+reply.from._id+'">'
		elem += '<input type="hidden" name="obj[_id]" value="'+comment._id+'"/>'
		elem += '<div class="form-group">'
			elem += '<textarea class="form-control" id="contentIpt-'+comment._id+reply.mark
			elem += '" name="obj[content]" row="3" '
			elem += 'placeholder="对 '+reply.from.code+' 回复：" />'
		elem += '</div>'
		elem += '<div class="form-group">'
			elem += '<button class="btn btn-link cancelButton2" data-pos="'
			elem += comment._id+reply.mark+'" type="button"> 取消 </button>'
			
			elem += '<button class="btn btn-primary submitButton" data-id="'
			elem += comment._id+'" data-mark='+reply.mark+' type="button"> 回复 </button>'
		elem += '</div>'
	elem += '</form>'
	elem += '<hr>'
	return elem;
}

/* ====== 初始加载 =====*/
let commentParam = '';
let commentElemId = '';
let role = '';
$(function() {
	commentsInit = () => {
		let commentFilter = $("#commentFilterAjax").val();
		if(commentFilter) {
			commentParam = commentFilter.split('@')[0];
			commentElemId = commentFilter.split('@')[1];
			role = commentFilter.split('@')[2];
		}
		urlQuery = commentParam;
		getComments(urlQuery, commentElemId, role);
	}
	commentsInit();

	/* ====== 品牌搜索加载 =====*/
	$("#commentSearch").blur((e) => {
		let keyword = $("#commentSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
		}
		urlQuery = commentParam + keyword;
		getComments(urlQuery, commentElemId, role);
	})
})