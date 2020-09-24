let Err = require('../../aaIndex/err');
let Conf = require('../../../../conf');

let Ordin = require('../../../models/firm/ord/ordin');
let Inquot = require('../../../models/firm/ord/inquot');
let Compd = require('../../../models/firm/ord/compd');

exports.usInquotStatusAjax = function(req, res) {
	let crUser = req.session.crUser;
	let id = req.query.id;
	let oldStatus = req.query.oldStatus;
	let newStatus = req.query.newStatus;
	Inquot.findOne({_id: id})
	.populate({
		path: 'compds',
		match: { 'qntpdSts': {'$ne': Conf.status.del.num }}
	})
	.exec((err, inquot) => {
		if(err) {
			console.log(err);
			info = "user InquotStatusAjax, findOne(), Error!, 请截图后, 联系管理员";
			Err.jsonErr(req, res, info);
		} else if(!inquot) {
			info = "user InquotStatusAjax 没有找到数据!, 请截图后, 联系管理员";
			Err.jsonErr(req, res, info);
		} else {
			let compds = inquot.compds;
			// console.log(inquot)
			// return;
			info = '错误操作, 请截图后, 联系管理员(usInquotStatusAjax)';
			if(oldStatus != inquot.status) {
				info = 'user InquotStatusAjax 数据不符, 刷新重试, 如果还是不能操作, 请截图后, 联系管理员';
			} else {
				if(oldStatus == Conf.status.init.num && newStatus == Conf.status.quoting.num) {
					// 询价员提交订单时
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.quoting.num && newStatus == Conf.status.pricing.num) {
					// 报价员完成初步报价 进入定价环节
					info = null;
					if(compds.length == 0) {
						info = "报价单中的商品不能为空"
					} else {
						for(let i=0; i<compds.length; i++) {
							if(compds[i].qntpdSts == Conf.status.quoting.num) {
								info = "刷新重试, 如果实在不能点击完成, 产品可选删除状态(usInquotStatusAjax quoting=>pricing)"
								break;
							}
						}
					}
					if(!info) {
						inquot.status = parseInt(newStatus);
					}
				}
				else if(oldStatus == Conf.status.pricing.num && newStatus == Conf.status.done.num) {
					// 完成定价, 进入销售筛选阶段
					info = null;
					let qntPr = 0;
					for(let i=0; i<compds.length; i++) {
						if(compds[i].qntpdSts == Conf.status.done.num) {
							let totpdPr = parseFloat(compds[i].qntPr)*parseInt(compds[i].quant);
							if(isNaN(totpdPr)) {
								info = '产品报价错误, 请仔细查看';
								break;
							} else if(compds[i].strmup == null) {
								info = '产品需要选择供应商, 请仔细查看';
								break;
							} else {
								qntPr += totpdPr;
							}
						}
					}
					if(!info) {
						inquot.qntPr = qntPr;
						inquot.status = parseInt(newStatus);
					}
				}
				else if(oldStatus == Conf.status.done.num && newStatus == Conf.status.unord.num) {
					// 询价员选择未成单
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.unord.num && newStatus == Conf.status.pricing.num) {
					// 管理员从未成单变为重新处理
					inquot.times++;
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.done.num && newStatus == Conf.status.quoting.num) {
					// 从完成返回 报价
					inquot.times++;
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.done.num && newStatus == Conf.status.pricing.num) {
					// 从完成返回 定价
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.pricing.num && newStatus == Conf.status.quoting.num) {
					// 从定价状态返回报价处理状态
					inquot.status = parseInt(newStatus);
					info = null;
				}
			}
			if(info) {
				Err.jsonErr(req, res, info);
			} else {
				usInquotStatusSave(req, res, inquot);
			}
		}
	})
}

let usInquotStatusSave = (req, res, inquot) => {
	inquot.save((err, objSave) => {
		if(err) {
			console.log(err);
			info = "user ChangeStatusAjax, findOne(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			res.json({ status: 1, msg: '',
				data: { inquot }
			})
		}
	})
}

exports.usOrdinStatusAjax = function(req, res) {
	let crUser = req.session.crUser;
	let id = req.query.id;
	let oldStatus = req.query.oldStatus;
	let newStatus = req.query.newStatus;
	Ordin.findOne({_id: id})
	.populate({
		path: 'compds',
		// match: { 'dinpdSts': {'$ne': Conf.status.del.num }}
	})
	.exec((err, ordin) => {
		if(err) {
			console.log(err);
			info = "user ChangeStatusAjax, findOne(), Error!";
			Err.jsonErr(req, res, info);
		} else if(!ordin) {
			info = "没有找到数据!";
			Err.jsonErr(req, res, info);
		} else {
			let compds = ordin.compds;

			info = '错误操作, 请截图后, 联系管理员(usOrdinStatusAjax)';
			if(oldStatus != ordin.status) {
				info = '数据不符, 请截图后, 联系管理员';
			} else {
				if(oldStatus == Conf.status.init.num && newStatus == Conf.status.checking.num) {
					// 销售员确定订单时
					info = null;
					let dinImp = 0;
					for(let i=0; i<compds.length; i++) {
						let totdinPr = parseFloat(compds[i].dinPr)*parseInt(compds[i].quant);
						if(isNaN(totdinPr)) {
							info = '产品定价错误, 请仔细查看';
							break;
						} else if(compds[i].strmup == null) {
							info = '产品需要选择供应商, 请仔细查看';
							break;
						} else {
							dinImp += totdinPr;
						}
					}
					if(!info) {
						ordin.dinImp = dinImp;
						ordin.status = parseInt(newStatus);
					}
				}
				else if(oldStatus == Conf.status.checking.num && newStatus == Conf.status.paiding.num) {
					// 管理员审核
					if(ordin.cter) {
						ordin.status = parseInt(newStatus);
						info = null;
					} else {
						info = "请添加客户信息到数据库"
					}
				}
				else if(oldStatus == Conf.status.paiding.num && newStatus == Conf.status.dealing.num) {
					// 完成付款, 开始处理订单
					ordinCompdStatus(req, res, compds, Conf.status.proding.num, 0);
					ordin.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.dealing.num && newStatus == Conf.status.delivering.num) {
					// 订单已经全部到达仓库, 准备发货
					ordinCompdStatus(req, res, compds, Conf.status.stocking.num, 0);
					ordin.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.delivering.num && newStatus == Conf.status.done.num) {
					// 发货时, 点击完成订单
					ordinCompdStatus(req, res, compds, Conf.status.done.num, 0);
					ordin.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.done.num && newStatus == Conf.status.delivering.num) {
					// 从完成返回 准备发货
					ordinCompdStatus(req, res, compds, Conf.status.stocking.num, 0);
					ordin.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.delivering.num && newStatus == Conf.status.dealing.num) {
					// 从准备发货, 返回到正在处理
					ordinCompdStatus(req, res, compds, Conf.status.proding.num, 0);
					ordin.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.dealing.num && newStatus == Conf.status.paiding.num) {
					// 从正在处理, 返回等待首款
					ordinCompdStatus(req, res, compds, Conf.status.init.num, 0);
					ordin.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.paiding.num && newStatus == Conf.status.checking.num) {
					// 从等待首款, 返回审核
					ordin.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.checking.num && newStatus == Conf.status.init.num) {
					// 从审核, 返回初始状态
					ordin.status = parseInt(newStatus);
					info = null;
				}
			}
			if(info) {
				Err.jsonErr(req, res, info);
			} else {
				usOrdinStatusSave(req, res, ordin);
			}
		}
	})
}

let usOrdinStatusSave = (req, res, ordin) => {
	ordin.save((err, objSave) => {
		if(err) {
			console.log(err);
			info = "user ChangeStatusAjax, findOne(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			res.json({ status: 1, msg: '',
				data: { ordin }
			})
		}
	})
}

let ordinCompdStatus = (req, res, compds, newStatus, n) => {
	if(n == compds.length) {
		return;
	} else {
		compds[n].dinpdSts = newStatus;
		compds[n].save((err, compdSave) => {
			if(err) console.log(err);
			ordinCompdStatus(req, res, compds, newStatus, n+1);
		})
	}
}