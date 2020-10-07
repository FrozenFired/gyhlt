var getNotifys = (urlQuery, elemId, role) => {
	// console.log(urlQuery)
	// console.log(elemId)
	// console.log(role)

	$.ajax({
		type: "GET",
		url: urlQuery,
		success: function(results) {
			if(results.status === 1) {
				notifys = results.data.notifys;
				notifysRender(notifys, elemId, role)
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
};

var notifysRender = (notifysOption, elemId, role) => {
	let elem = '';
	for(let i=0; i<notifysOption.length; i++) {
		let notify = notifysOption[i];
			elem += notifyRender(notify, role)
	}
	$(".notifysElem").remove();
	if(!elemId) elemId = "#notifysElem"
	$(elemId).append(elem);
}
var notifyRender = (notify, role) => {
	let elem = '';
	elem += '<div class="media mt-4">'
	elem += '<div class="media-right media-body pl-2">'
		ts = timeSpan(Date.parse(notify.crtAt));
		/* --------------------------------  一级留言title及内容 -------------------------------- */
		elem += '<h5>'
			elem += '<span class="bg-dark text-white px-2 mr-4">'+notify.mark+'</span>'
			elem += '<span class="mr-2">'+notify.from.code+'</span>'
			// elem += '<span class="mr-2 text-secondary">@'+notify.to.code+'</span>'
			elem += '<small class="text-secondary mr-5">('+ts+')</small>'
			if(notify.read == -1) {
				if(notify.to._id == crUserId) {
					elem += '<button id="readBtn-'+notify._id+'" class="btn border-warning readBtn text-warning" data-id='
					elem += notify._id+'><span class="oi oi-bookmark"></span></button>'
				} else {
					elem += '<span class="text-warning"><span class="oi oi-bookmark"></span></span>'
				}
			}
		elem += '</h5>'
		elem += '<div>'+notify.content+'</div>' 
		/* ----------------------------------  对一级留言的回复框 ---------------------------------- */
		elem += '<div id="replyform-'+notify._id+'">'
			elem += '<button class="btn btn-link replyButton" id="replyButton-'+notify._id
			elem += '" data-id="'+notify._id+'" type="button"> 回复 </button>'

			elem += '<form id="notifyForm-'+notify._id+'" method="POST" action="/usNotifyReplyAjax" style="display:none">'
				elem += '<input type="hidden" name="obj[to]" value="'+notify.from._id+'" />'
				elem += '<input type="hidden" name="notify" value="'+notify._id+'"/>'
				elem += '<div class="form-group row">'
					elem += '<textarea class="form-control" id="contentIpt-'+notify._id+'" name="obj[content]" row="3" '
					elem += 'placeholder="对 '+notify.from.code+' 回复："/>'
				elem += '</div>'
				elem += '<div class="form-group row">'
					elem += '<button class="btn btn-link cancelButton" id="cancelButton-'+notify._id
					elem += '" data-id="'+notify._id+'" type="button" style="display:none"> 取消 </button>'

					elem += '<button class="btn btn-primary submitButton" '
					elem += 'data-id="'+notify._id+'" type="button"> 回复 </button>'
				elem += '</div>'
			elem += '</form>'
		elem += '</div>'
		let display = 'none';
		if(notify.replys && notify.replys.length > 0) {
			display = 'block';
		}
		/* =======================  查看隐藏 二级留言 按钮 ======================= */
		elem += '<div id="reply-'+notify._id+'" style="display:'+display+'">';
			elem += '<button class="btn btn-link showReply" data-id="'+notify._id+'" '
			elem += 'type="button" style="display:none"> 查看所有 <span id="replysNum-'+notify._id+'">'
			elem += notify.replys.length+ '</span>条回复</button>'

			elem += '<button class="btn btn-link hideReply" data-id="'+notify._id+'" '
			elem += 'type="button" > 隐藏所有回复</button>'
		elem += '</div>'
		/* =============================  二级留言列表 ============================= */
		elem += '<div class="ml-3" id="allReply-'+notify._id+'" style="display: block">'
			for(let i=0; i<notify.replys.length; i++) {
				elem += replyRender(notify, notify.replys[i]);
			}
		elem += '</div>'
	elem += '</div>'
	elem += '</div>'
	return elem;
}
var replyRender = (notify, reply, role) => {
	let elem = '';
	bgClor = "";
	if(reply.from._id == crUserId) bgClor = "bg-success";
	elem += '<div class="'+bgClor+'">'
		ts = timeSpan(Date.parse(reply.crtAt));
		/* =============================  二级留言title ============================= */
		elem += '<span class="bg-secondary text-white px-2 mr-3">'+reply.mark+'</span>'
		elem += '<span class="mr-2">' + reply.from.code+'</span>'	// 回复的哪条信息
		if(reply.reply) {
			elem += '<span class="bg-secondary px-2" title="'+reply.reply.content+'">'
				elem += '<a class="text-white mr-2">@ '+reply.reply.mark+':</a>'
				let content = reply.reply.content
				if(content.length > 20) content = content.slice(0, 20) + '...'
				elem += '<span>'+ content +'</span>'
			elem += '</span>'
		}
		elem += ': <small class="text-secondary mr-5">('+ts+')</small>'
		if(reply.read == -1) {
			if(reply.to._id == crUserId) {
				elem += '<button id="readBtn-'+reply._id+'" class="btn border-warning readBtn text-warning" data-id='
				elem += reply._id+' ><span class="oi oi-bookmark"></span></button>'
			} else {
				elem += '<span class="text-warning"><span class="oi oi-bookmark"></span></span>'
			}
		}
		if(crUserId != reply.from._id) {
			elem += '<span>'
				elem += '<button class="btn btn-link replyButton2" data-pos="'+notify._id
				elem += reply.mark+'" type="button"> 回复 </button>'
			elem += '</span>'
		}
	elem += '</div>'
	/* =============================  二级留言回复的二级留言 ============================= */

	/* =============================  二级留言内容 ============================= */
	elem += '<p>'+ reply.content +'</p>'

	/* =============================  对二级留言的回复框 ============================= */
	elem += '<form id="notifyForm2-'+notify._id+reply.mark+'" method="POST" '
	elem += 'action="/usNotifyReplyAjax", style="display:none">'
		// input(type="hidden", name="obj[" + point + "]", value=object._id)
		// input(type="hidden", name="obj[cid]", value=notify._id)
		elem += '<input type="hidden" name="notify" value="'+notify._id+'"/>'
		elem += '<input type="hidden", name="obj[to]", value="'+reply.from._id+'">'
		elem += '<input type="hidden", name="obj[reply]", value="'+reply._id+'">'
		elem += '<div class="form-group">'
			elem += '<textarea class="form-control" id="contentIpt-'+notify._id+reply.mark
			elem += '" name="obj[content]" row="3" '
			elem += 'placeholder="对 '+reply.from.code+' 回复：" />'
		elem += '</div>'
		elem += '<div class="form-group">'
			elem += '<button class="btn btn-link cancelButton2" data-pos="'
			elem += notify._id+reply.mark+'" type="button"> 取消 </button>'

			elem += '<button class="btn btn-primary submitButton" data-id="'
			elem += notify._id+'" data-mark='+reply.mark+' type="button"> 回复 </button>'
		elem += '</div>'
	elem += '</form>'
	elem += '<hr>'
	return elem;
}

/* ====== 初始加载 =====*/
let crUserId = '';
let reUserId = '';
let notifyParam = '';
let notifyElemId = '';
let role = '';
$(function() {
	notifysInit = () => {
		crUserId = $("#crUserId").val();
		reUserId = $("#reUserId").val();

		let notifyFilter = $("#notifyFilterAjax").val();
		if(notifyFilter) {
			notifyParam = notifyFilter.split('@')[0];
			notifyElemId = notifyFilter.split('@')[1];
			role = notifyFilter.split('@')[2];
		}
		urlQuery = notifyParam;
		getNotifys(urlQuery, notifyElemId, role);
	}
	notifysInit();

	/* ====== 品牌搜索加载 =====*/
	$("#notifySearch").blur((e) => {
		let keyword = $("#notifySearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
		}
		urlQuery = notifyParam + keyword;
		getNotifys(urlQuery, notifyElemId, role);
	})
})