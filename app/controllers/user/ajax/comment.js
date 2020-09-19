let Err = require('../../aaIndex/err');
let Conf = require('../../../../conf');

let Comment = require('../../../models/firm/comment');

/* ===================== 客户搜索系列名或产品编号出的结果 ===================== */
exports.usCommentsAjax = (req, res) => {
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

	let statusSymb = '$ne';
	let statusConb = -1;

	let param = {
		inquot: {[inquotSymb]: inquotConb},
		ordin: {[ordinSymb]: ordinConb},

		status: {[statusSymb]: statusConb},
	}
	Comment.countDocuments(param, (err, count) => {
		if(err) {
			console.log(err);
			info = "user CommentsAjax, Comment.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Comment.find(param)
			.populate('from')
			.populate('replys.from')
			.populate('replys.to')
			.sort({'weight': -1, 'upAt': -1})
			.limit(limit).exec((err, comments) => {
				if(err) console.log(err);
				let isMore = 1;
				if(count <= limit) isMore = 0;

				res.json({
					status: 1,
					msg: '',
					data: {
						comments,
						count,
						isMore,
					}
				});
			})
		}
	})
}

exports.usCommentNewAjax = (req, res) => {
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
	Comment.find({
		[point] : relId
	}, (err, comments) => {
		if(err) {
			console.log(err);
			info = "添加留言时 操作错误, 请截图后, 联系管理员";
			Err.jsonErr(req, res, info);
		} else {
			obj.mark = comments.length
			// return;
			let _comment = new Comment(obj)

			_comment.save((err, comment) => {
				if(err) {
					console.log(err);
					info = "添加留言时 数据库保存错误, 请截图后, 联系管理员";
					Err.jsonErr(req, res, info);
				} else {
					// console.log(comment)
					Comment.findOne({_id: comment._id})
					.populate('from')
					.exec((err, comment) => {

						res.json({
							status: 1,
							msg: '',
							data: {
								comment,
							}
						});
					})
				}
			})
		}
	})
}

exports.usCommentReplyAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	Comment.findOne({_id: obj._id}, (err, comment) => {
		if(err) {
			console.log(err);
			info = "添加回复时 操作错误, 请截图后, 联系管理员";
			Err.jsonErr(req, res, info);
		} else {
			var mark = comment.replys.length
			var reply = {
				mark : mark,
				from: crUser._id,
				to: obj.to,
				content: obj.content,
				ctAt: Date.now()
			}
			comment.replys.unshift(reply)
			comment.save((err, comment) => {
				if(err) {
					console.log(err)
					info = "添加评论回复时 数据库保存错误, 请截图后, 联系管理员";
					Err.jsonErr(req, res, info);
				} else {
					Comment.findOne({_id: obj._id})
					.populate('replys.from')
					.populate('replys.to')
					.exec((err, comment) => {
						if(err) {
							console.log(err);
							info = "添加回复时 页面错误, 请刷新";
							Err.jsonErr(req, res, info);
						} else {
							res.json({
								status: 1,
								msg: '',
								data: {
									comment,
									reply: comment.replys[0]
								}
							});
						}
					})
				}
			})
		}
	})
}