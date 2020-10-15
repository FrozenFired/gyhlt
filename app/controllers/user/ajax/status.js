let Err = require('../../aaIndex/err');
let Conf = require('../../../../conf');

let Ordin = require('../../../models/firm/ord/ordin');
let Ordut = require('../../../models/firm/ord/ordut');
let Tran = require('../../../models/firm/ord/tran');
let Inquot = require('../../../models/firm/ord/inquot');
let Compd = require('../../../models/firm/ord/compd');

exports.usInquotQuterStAjax = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.query.id;
	let newStatus
	info = null;
	if(!req.query.newStatus) {
		info = "user InquotQuterStAjax, if(!req.query.newStatus) 操作错误, 请联系管理员"
	} else {
		newStatus = parseInt(req.query.newStatus);
		if(isNaN(newStatus)) {
			info = "user InquotQuterStAjax, if(isNaN(newStatus)) 操作错误, 请联系管理员";
		} else if(newStatus != Conf.status.init.num && newStatus != Conf.status.done.num) {
			info = "user InquotQuterStAjax, 状态值错误, 请联系管理员";
		}
	}
	if(info) {
		Err.jsonErr(req, res, info);
	} else {
		Inquot.findOne({_id: id})
		.exec((err, inquot) => {
			if(err) {
				console.log(err);
				info = "user InquotStatusAjax, findOne(), Error!, 请截图后, 联系管理员";
				Err.jsonErr(req, res, info);
			} else if(!inquot) {
				info = "user InquotStatusAjax 没有找到数据!, 请截图后, 联系管理员";
				Err.jsonErr(req, res, info);
			} else {
				inquot.quterSt = newStatus;
				usInquotStatusSave(req, res, inquot);
			}
		})
	}
}
exports.usInquotStatusAjax = (req, res) => {
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
					if(inquot.quner == "5f85925f94ac0c50a98606a2") {
						inquot.quter = "5eea52dce61fa97e3ff44fdc";
					}
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
				else if(oldStatus == Conf.status.pricing.num && newStatus == Conf.status.confirm.num) {
					// 完成定价, 进入销售筛选阶段
					info = null;
					for(let i=0; i<compds.length; i++) {
						if(compds[i].qntpdSts == Conf.status.done.num) {
							let qntPrTot = parseFloat(compds[i].qntPr)*parseInt(compds[i].quant);
							let dutPrTot = parseFloat(compds[i].dutPr)*parseInt(compds[i].quant);
							if(compds[i].strmup == null) {
								info = '产品需要选择供应商, 请仔细查看';
								break;
							} else if(isNaN(qntPrTot)) {
								info = '产品报价错误, 或数量填写错误, 请仔细查看';
								break;
							} else if(qntPrTot <= 0) {
								info = '产品报价错误, 或数量填写错误, 请仔细查看';
								break;
							} else if(isNaN(dutPrTot)) {
								info = '产品采购价错误, 或数量填写错误, 请仔细查看';
								break;
							} else if(dutPrTot <= 0) {
								info = '产品采购价错误, 或数量填写错误, 请仔细查看';
								break;
							}
						}
					}
					if(!info) {
						inquot.status = parseInt(newStatus);
					}
				}
				else if(oldStatus == Conf.status.confirm.num && newStatus == Conf.status.pending.num) {
					// 询价员选择成单, 确认中变为付款中
					info = null;
					for(let i=0; i<compds.length; i++) {
						if(compds[i].qntpdSts == Conf.status.done.num) {
							let qntPrTot = parseFloat(compds[i].dinPr)*parseInt(compds[i].quant);
							if(isNaN(qntPrTot)) {
								info = '产品采购价错误, 或数量填写错误, 请仔细查看';
								break;
							} else if(qntPrTot <= 0) {
								info = '产品采购价错误, 或数量填写错误, 请仔细查看';
								break;
							}else if(compds[i].strmup == null) {
								info = '产品需要选择供应商, 请仔细查看';
								break;
							}
						}
					}
					if(!info) {
						inquot.status = parseInt(newStatus);
					}
				}
				else if(oldStatus == Conf.status.confirm.num && newStatus == Conf.status.unord.num) {
					// 询价员选择未成单
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.unord.num && newStatus == Conf.status.pricing.num) {
					// 管理员从未成单变为重新处理定价
					inquot.times++;
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.pending.num && newStatus == Conf.status.confirm.num) {
					// 管理员从付款中的状态, 退回到确认中的状态
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.confirm.num && newStatus == Conf.status.quoting.num) {
					// 从确认中返回 报价
					inquot.times++;
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.confirm.num && newStatus == Conf.status.pricing.num) {
					// 从确认中返回 定价
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.pricing.num && newStatus == Conf.status.quoting.num) {
					// 从定价状态返回报价处理状态
					inquot.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.quoting.num && newStatus == Conf.status.init.num) {
					// 返回初始状态
					inquot.quter = null;
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

exports.usOrdinStatusAjax = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.query.id;
	let oldStatus = req.query.oldStatus;
	let newStatus = req.query.newStatus;
	Ordin.findOne({_id: id})
	.populate('bills')
	.populate({
		path: 'compds',
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
				if(oldStatus == Conf.status.unpaid.num && newStatus == Conf.status.deposit.num) {
					// 确认收到首款后, 从未付款状态变为付款状态
					if(ordin.bills.length == 0) {
						info = "请先收款"
					} else {
						ordinCompdStatus(req, res, compds, Conf.status.init.num, Conf.status.waiting.num, 0);
						ordin.status = parseInt(newStatus);
						info = null;
					}
				}
				else if(oldStatus == Conf.status.deposit.num && newStatus == Conf.status.payoff.num) {
					// 全部付款后, 状态变为付清
					if(ordin.dinImp - ordin.billPr > (ordin.dinImp)* 2/100) {
						info = "还未付清"
					} else {
						ordin.status = parseInt(newStatus);
						info = null;
					}
				}
				else if(oldStatus == Conf.status.payoff.num && newStatus == Conf.status.done.num) {
					// 从付清状态, 变为完成状态
					let i=0;
					for(; i<compds.length; i++) {
						if(compds[i].compdSts != Conf.status.stocking.num) break;
					}
					if(i != compds.length) {
						info = "其中的商品不在仓库, 不可完成"
					} else {
						ordinCompdStatus(req, res, compds, Conf.status.stocking.num, Conf.status.done.num, 0);
						ordin.fnhAt = Date.now();
						ordin.status = parseInt(newStatus);
						info = null;
					}
				}
				else if(oldStatus == Conf.status.done.num && newStatus == Conf.status.payoff.num) {
					// 点错, 从完成返回到付清状态
					ordinCompdStatus(req, res, compds, Conf.status.done.num, Conf.status.stocking.num, 0);
					ordin.fnhAt = null;
					ordin.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.payoff.num && newStatus == Conf.status.deposit.num) {
					// 点错, 返回到付首款状态
					ordin.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.deposit.num && newStatus == Conf.status.unpaid.num) {
					// 从完成返回 准备发货
					info = null;
					if(ordin.bills.length != 0) {
						info = "请先删除已付款项"
					}
					let i=0;
					for(; i<compds.length; i++) {
						if(compds[i].compdSts != Conf.status.waiting.num) break;
					}
					if(i != compds.length) {
						info = "其中的商品已经在生产了, 不可返回"
					}
					if(!info) {
						ordinCompdStatus(req, res, compds,  Conf.status.waiting.num, Conf.status.init.num, 0);
						ordin.status = parseInt(newStatus);
					}
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

let ordinCompdStatus = (req, res, compds, fromSts, newStatus, n) => {
	if(n == compds.length) {
		return;
	} else {
		if(compds[n].compdSts == fromSts) {
			compds[n].compdSts = newStatus;
			compds[n].save((err, compdSave) => {
				if(err) console.log(err);
				ordinCompdStatus(req, res, compds, fromSts, newStatus, n+1);
			})
		} else {
			ordinCompdStatus(req, res, compds, fromSts, newStatus, n+1);
		}
	}
}



exports.usOrdutStatusAjax = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.query.id;
	let oldStatus = req.query.oldStatus;
	let newStatus = req.query.newStatus;
	Ordut.findOne({_id: id})
	.populate('bills')
	.populate({
		path: 'compds',
	})
	.exec((err, ordut) => {
		if(err) {
			console.log(err);
			info = "user ChangeStatusAjax, findOne(), Error!";
			Err.jsonErr(req, res, info);
		} else if(!ordut) {
			info = "没有找到数据!";
			Err.jsonErr(req, res, info);
		} else {
			let compds = ordut.compds;

			info = '错误操作, 请截图后, 联系管理员(usOrdutStatusAjax)';
			if(oldStatus != ordut.status) {
				info = '数据不符, 请截图后, 联系管理员';
			} else {
				if(oldStatus == Conf.status.init.num && newStatus == Conf.status.unpaid.num) {
					// 确认采购, 进入开始付款状态
					info = null;
					let dutImp = 0;
					for(let i=0; i<compds.length; i++) {
						let dutPrTot = parseFloat(compds[i].dutPr)*parseInt(compds[i].quant);
						dutImp += dutPrTot;
						if(compds[i].strmup == null) {
							info = '产品需要选择供应商, 请仔细查看';
							break;
						} else if(isNaN(dutPrTot)) {
							info = '产品采购价错误, 或数量填写错误, 请仔细查看';
							break;
						} else if(dutPrTot <= 0) {
							info = '产品采购价错误, 或数量填写错误, 请仔细查看';
							break;
						}
					}
					if(!info) {
						ordut.dutImp = dutImp;
						ordut.status = parseInt(newStatus);
					}
				}
				else if(oldStatus == Conf.status.unpaid.num && newStatus == Conf.status.deposit.num) {
					// 确认付首款后, 从未付款状态变为付款状态
					if(ordut.bills.length == 0) {
						info = "请先付款"
					} else {
						ordut.status = parseInt(newStatus);
						info = null;
					}
				}
				else if(oldStatus == Conf.status.deposit.num && newStatus == Conf.status.payoff.num) {
					// 全部付款后, 状态变为付清
					if(ordut.dutImp - ordut.billPr > (ordut.dutImp)* 2/100) {
						info = "还未付清"
					} else {
						ordut.status = parseInt(newStatus);
						info = null;
					}
				}
				else if(oldStatus == Conf.status.payoff.num && newStatus == Conf.status.done.num) {
					// 完成采购单, 可以开始运输
					ordutCompdStatus(req, res, compds,  Conf.status.proding.num, Conf.status.tranpre.num, 0);
					ordut.fnhAt = Date.now();
					ordut.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.done.num && newStatus == Conf.status.payoff.num) {
					// 点错, 从完成返回到付清状态
					let i=0;
					for(; i<compds.length; i++) {
						if(compds[i].compdSts != Conf.status.tranpre.num) break;
					}
					if(i != compds.length) {
						info = "其中的商品已经在运输, 不可返回"
					} else {
						ordutCompdStatus(req, res, compds,  Conf.status.tranpre.num, Conf.status.proding.num, 0);
						ordut.fnhAt = null;
						ordut.status = parseInt(newStatus);
						info = null;
					}
				}
				else if(oldStatus == Conf.status.payoff.num && newStatus == Conf.status.deposit.num) {
					// 点错, 返回到付首款状态
					ordut.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.deposit.num && newStatus == Conf.status.unpaid.num) {
					// 从已付首款, 返回到未付状态
					if(ordut.bills.length != 0) {
						info = "请先删除, 已付款项"
					} else {
						ordut.status = parseInt(newStatus);
						info = null;
					}
				}
				else if(oldStatus == Conf.status.unpaid.num && newStatus == Conf.status.init.num) {
					// 从未付状态, 返回到初始状态
					ordut.status = parseInt(newStatus);
					info = null;
				}
			}
			if(info) {
				Err.jsonErr(req, res, info);
			} else {
				usOrdutStatusSave(req, res, ordut);
			}
		}
	})
}

let usOrdutStatusSave = (req, res, ordut) => {
	ordut.save((err, objSave) => {
		if(err) {
			console.log(err);
			info = "user ChangeStatusAjax, findOne(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			res.json({ status: 1, msg: '',
				data: { ordut }
			})
		}
	})
}

let ordutCompdStatus = (req, res, compds, fromSts, newStatus, n) => {
	if(n == compds.length) {
		return;
	} else {
		if(compds[n].compdSts == fromSts) {
			compds[n].compdSts = newStatus;
			compds[n].save((err, compdSave) => {
				if(err) console.log(err);
				ordutCompdStatus(req, res, compds, fromSts, newStatus, n+1);
			})
		} else {
			ordutCompdStatus(req, res, compds, fromSts, newStatus, n+1);
		}
	}
}



exports.usTranStatusAjax = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.query.id;
	let oldStatus = req.query.oldStatus;
	let newStatus = req.query.newStatus;
	Tran.findOne({_id: id})
	.populate('bills')
	.populate({
		path: 'compds',
	})
	.exec((err, tran) => {
		if(err) {
			console.log(err);
			info = "user ChangeStatusAjax, findOne(), Error!";
			Err.jsonErr(req, res, info);
		} else if(!tran) {
			info = "没有找到数据!";
			Err.jsonErr(req, res, info);
		} else {
			let compds = tran.compds;
			info = '错误操作, 请截图后, 联系管理员(usTranStatusAjax)';
			if(oldStatus != tran.status) {
				info = '数据不符, 请截图后, 联系管理员';
			} else {
				if(oldStatus == Conf.status.init.num && newStatus == Conf.status.customin.num) {
					// 确认运输, 进入报关状态
					tran.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.customin.num && newStatus == Conf.status.shipping.num) {
					// 完成报关, 开始海运
					tran.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.shipping.num && newStatus == Conf.status.customut.num) {
					// 点击开始清关
					tran.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.customut.num && newStatus == Conf.status.done.num) {
					// 完成清关, 此运输完成, 商品进入仓库
					let i=0;
					for(; i<compds.length; i++) {
						if(compds[i].compdSts != Conf.status.traning.num) break;
					}
					if(i != compds.length) {
						info = "其中的商品状态有问题, 不可完成"
					} else {
						tranCompdStatus(req, res, compds,  Conf.status.traning.num, Conf.status.stocking.num, 0);
						tran.status = parseInt(newStatus);
						info = null;
					}
				}
				else if(oldStatus == Conf.status.done.num && newStatus == Conf.status.customut.num) {
					// 点错, 从完成返回到清关状态, 商品返回到在途状态
					let i=0;
					for(; i<compds.length; i++) {
						if(compds[i].compdSts != Conf.status.stocking.num) break;
					}
					if(i != compds.length) {
						info = "其中的商品已经完成, 不可返回"
					} else {
						tranCompdStatus(req, res, compds,  Conf.status.stocking.num, Conf.status.traning.num, 0);
						tran.status = parseInt(newStatus);
						info = null;
					}
				}
				else if(oldStatus == Conf.status.customut.num && newStatus == Conf.status.shipping.num) {
					// 点错, 返回到海运状态
					tran.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.shipping.num && newStatus == Conf.status.customin.num) {
					// 返回到报关状态
					tran.status = parseInt(newStatus);
					info = null;
				}
				else if(oldStatus == Conf.status.customin.num && newStatus == Conf.status.init.num) {
					// 从报关状态, 返回到初始状态
					tran.status = parseInt(newStatus);
					info = null;
				}
			}
			if(info) {
				Err.jsonErr(req, res, info);
			} else {
				usTranStatusSave(req, res, tran);
			}
		}
	})
}

let usTranStatusSave = (req, res, tran) => {
	tran.save((err, objSave) => {
		if(err) {
			console.log(err);
			info = "user ChangeStatusAjax, findOne(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			res.json({ status: 1, msg: '',
				data: { tran }
			})
		}
	})
}

let tranCompdStatus = (req, res, compds, fromSts, newStatus, n) => {
	if(n == compds.length) {
		return;
	} else {
		if(compds[n].compdSts == fromSts) {
			compds[n].compdSts = newStatus;
			compds[n].save((err, compdSave) => {
				if(err) console.log(err);
				tranCompdStatus(req, res, compds, fromSts, newStatus, n+1);
			})
		} else {
			tranCompdStatus(req, res, compds, fromSts, newStatus, n+1);
		}
	}
}