const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Notify = require('../../../models/firm/notify');

/* ===================== 客户搜索系列名或产品编号出的结果 ===================== */
exports.usNotifysAjax = (req, res) => {
	let crUser = req.session.crUser;
	let limit = 20000;

	let inquotSymb = ordinSymb = '$ne';
	let inquotConb = ordinConb = '5ff048c3492e450ddd5aa55f';
	if(req.query.inquot) {
		inquotSymb = '$eq'
		inquotConb = req.query.inquot;
	} else if(req.query.ordin) {
		ordinSymb = '$eq'
		ordinConb = req.query.ordin;
	}

	let toSymb = fromSymb = '$ne';
	let toConb = fromConb = '5ef5060950e7861420fe75c9';
	if(req.query.to) {
		toSymb = '$eq'
		toConb = req.query.to;
	}
	if(req.query.from) {
		fromSymb = '$eq'
		fromConb = req.query.from;
	}

	let readSymb = '$ne';
	let readConb = -100;
	if(req.query.read) {
		readSymb = '$eq'
		readConb = parseInt(req.query.read);
	}

	let levelSymb = '$eq';
	let levelConb = 1;
	if(req.query.level) {
		levelSymb = '$ne'
		levelConb = -100;
	}

	let param = {
		inquot: {[inquotSymb]: inquotConb},
		ordin: {[ordinSymb]: ordinConb},

		to: {[toSymb]: toConb},
		from: {[fromSymb]: fromConb},

		read: {[readSymb]: readConb},
		level: {[levelSymb]: levelConb},
	}
	Notify.countDocuments(param, (err, count) => {
		if(err) {
			console.log(err);
			info = "user NotifysAjax, Notify.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Notify.find(param)
			.populate('from').populate('to')
			.populate('inquot').populate('ordin')
			.populate('belong')
			.populate({path:'replys', populate: [{path: 'from'}, {path: 'to'}, {path: 'reply'}]})
			.sort({'weight': -1, 'updAt': -1})
			.limit(limit).exec((err, notifys) => {
				if(err) console.log(err);
				let isMore = 1;
				if(count <= limit) isMore = 0;

				res.json({
					status: 1,
					msg: '',
					data: {
						notifys,
						count,
						isMore,
					}
				});
			})
		}
	})
}

exports.usNotifyNewAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	let point, relId;
	if(obj.inquot) {
		point = 'inquot';
		relId = obj.inquot;
	} else if(obj.ordin) {
		point = 'ordin';
		relId = obj.ordin;
	}
	Notify.find({
		[point] : relId
	}, (err, notifys) => {
		if(err) {
			console.log(err);
			info = "添加留言时 操作错误, 请截图后, 联系管理员";
			Err.jsonErr(req, res, info);
		} else {
			obj.mark = notifys.length+1
			// return;
			let _object = new Notify(obj)

			_object.save((err, notifySave) => {
				if(err) {
					console.log(err);
					info = "添加留言时 数据库保存错误, 请截图后, 联系管理员";
					Err.jsonErr(req, res, info);
				} else {
					// console.log(notifySave)
					Notify.findOne({_id: notifySave._id})
					.populate('from')
					.exec((err, notify) => {

						res.json({
							status: 1,
							msg: '',
							data: {
								notify,
							}
						});
					})
				}
			})
		}
	})
}

exports.usNotifyReplyAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	// console.log(obj)
	let notify = req.body.notify;
	Notify.findOne({_id: notify}, (err, notify) => {
		if(err) {
			console.log(err);
			info = "user NotifyReplyAjax, Notify.findOne, Error!";
			Err.jsonErr(req, res, info);
		} else {
			// 如果是 回复给一级留言 而且一级留言人是本人 则标记为已读
			if(notify.from == crUser._id && !obj.reply) {
				obj.read = 1;
			}
			obj.belong = notify._id;
			obj.from = crUser._id;
			obj.mark = notify.replys.length+1;
			obj.level = 2;
			let _object = new Notify(obj)
			if(notify.read == -1 && notify.to == crUser._id) {
				notify.read = 1;
			}
			notify.replys.unshift(_object._id)
			notify.save((err, notifySave) => {
				if(err) {
					console.log(err)
					info = "user NotifyReplyAjax, notify.save, Error!";
					Err.jsonErr(req, res, info);
				} else {
					_object.save((err, objSave) => {
						if(err) {
							console.log(err);
							info = "user NotifyReplyAjax, _object.save, Error!";
							Err.jsonErr(req, res, info);
						} else {
							// console.log(objSave)
							Notify.findOne({_id: objSave._id})
							.populate('from')
							.populate('reply')
							.exec((err, reply) => {
								if(err) {
									console.log(err);
									info = "user NotifyReplyAjax, Notify.findOne, Error!";
									Err.jsonErr(req, res, info);
								} else {
									let reNotify = reply.reply;
									if(reNotify && reNotify.read == -1 && reNotify.to == crUser._id) {
										reNotify.read = 1
										reNotify.save((err, reNotifySave) => {
											if(err) {
												console.log(err)
											}
										})
									}
									res.json({
										status: 1,
										msg: '',
										data: {
											notify,
											reply
										}
									});
								}
							})
						}
					})
				}
			})
		}
	})
}


exports.usNotifyReadAjax = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Notify.findOne({
		_id: id
	}, (err, notify) => {
		if(err) {
			console.log(err);
			info = "user NotifyReadAjax, Notify.findOne, Error!";
			Err.jsonErr(req, res, info);
		} else if(!notify) {
			info = "没有找到该留言, 请刷新重试!";
			Err.jsonErr(req, res, info);
		} else {
			notify.read = 1
			notify.save((err, notifySave) => {
				if(err) {
					console.log(err);
					info = "user NotifyReadAjax, Notify.findOne, Error!";
					Err.jsonErr(req, res, info);
				} else {
					res.json({status: 1, msg: '', data: {} });
				}
			})
		}
	})
}