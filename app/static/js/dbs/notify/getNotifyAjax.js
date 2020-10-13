$(function() {
	let crUserId = $("#crUserId").val();
	let crUserRole = $("#crUserRole").val();
	let role = '';

	for(rl in Conf.roleUser) {
		if(crUserRole == Conf.roleUser[rl].num) {
			role = Conf.roleUser[rl].code;
		}
	}

	getNotifysHeader = function() {
		$.ajax({
			type: "GET",
			url: '/usNotifysAjax?level=yes&read=-1&to='+crUserId,
			success: function(results) {
				if(results.status === 1) {
					let notifys = results.data.notifys
					if(notifys.length > 0) {
						$(".notifyHeaderBtn").show();
						$("#notifyHeader").text(notifys.length)
						let elem = '';
						for(let i=0; i<notifys.length; i++) {
							let notify = notifys[i];

							detail = 'Qut'
							if(crUserRole == Conf.roleUser.seller.num) {
								detail = 'Qun'
							}
							let resUrl = '/'+role+detail+'/';

							let desp = notify.from.code +'在'

							if(notify.ordin) {
								alert("联系程序员, 加入此功能")
							} else if(notify.inquot){
								let inquot = notify.inquot;
								resUrl += inquot._id;
								desp += '询价单'+inquot.code + '中给您留言'
								if(notify.level == 1) {
									desp += ': 第'+notify.mark+'条一级留言'
								} else {
									desp += ': 第'+notify.belong.mark+'条一级留言中的 第'+notify.mark+'条二级留言'
								}
							}
							elem += '<a class="dropdown-item notifyLink" href="'+resUrl+'">'+desp+'</a>'
						}
						$(".notifyLink").remove();
						$("#whereNotifys").append(elem)
					} else {
						$(".notifyHeaderBtn").hide();
					}
				} else if(results.status === 0) {
					alert(results.msg);
				}
			}
		});
	}

	getNotifysHeader();

})