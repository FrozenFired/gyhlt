// 运输 集装箱
const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Tran = require('../../../models/firm/ord/tran');
const Compd = require('../../../models/firm/ord/compd');

const Strmlg = require('../../../models/firm/stream/strmlg');
const Ordut = require('../../../models/firm/ord/ordut');

const _ = require('underscore');

const moment = require('moment');
const xl = require('excel4node');

// 运输管理
exports.mgTrans = (req, res) => {
	let crUser = req.session.crUser;
	Strmlg.find({firm: crUser.firm})
	.exec((err, strmlgs) => {
		if(err) {
			console.log(err);
			info = "mger Trans, Strmlg.find, Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./user/mger/tran/list', {
				title: '运输管理',
				crUser,
				strmlgs
			})
		}
	})
}

exports.mgTranNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	obj.lger = crUser._id;
	obj.status = Conf.status.init.num;

	let now = new Date();
	let year = now.getFullYear();
	let initYear = year+"-01-01 00:00:00";
	let initDate = new Date(initYear);
	Tran.find({
		firm: crUser.firm,
		crtAt: {"$gte": initDate},
	}, (err, trans) => {
		if(err) {
			console.log(err);
			info = "mger TranNew Tran.find, Error!";
			Err.usError(req, res, info);
		} else {
			let len = String(trans.length+1);
			if(len.length < 4) {
				for(let i=len.length; i < 4; i++) { // 序列号补0
					len = "0"+len;
				}
			}
			obj.code = year+'GYIT'+len;
			if(obj.nome) obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			let _tran = new Tran(obj)

			_tran.save((err, objSave) => {
				if(err) {
					console.log(err);
					info = "mger TranNew _tran.save, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect('/mgTran/'+objSave._id)
				}
			})
		}
	})
}


exports.mgTran = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Tran.findOne({_id: id})
	.populate('lger')
	.populate('strmlg')
	.populate('bills')
	.populate({
		path: 'compds',
		options: { sort: { 'ordut': 1, 'pdnum': 1 } },
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},

			{path: 'ordut'},
		]
	})
	.exec((err, tran) => {
		if(err) {
			console.log(err);
			info = "mger Tran, Tran.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!tran) {
			info = "这个运输单已经被删除, mgTranFilter";
			Err.usError(req, res, info);
		} else {
			// console.log(tran)
			Strmlg.find({
				firm: crUser.firm,
			})
			.sort({'role': -1})
			.exec((err, strmlgs) => {
				if(err) {
					console.log(err);
					info = 'mger Tran, Strmlg.find, Error!';
					Err.usError(req, res, info);
				} else {
					Ordut.find({
						firm: crUser.firm,
						status: Conf.status.done.num,
					})
					.populate('strmup')
					.populate({
						path: 'compds',
						match: { 'compdSts': Conf.status.tranpre.num},
						populate: [
							{path: 'brand'},
							{path: 'pdfir'},
							{path: 'pdsec'},
							{path: 'pdthd'},
						]
					})
					.exec((err, duts) => {
						if(err) {
							console.log(err);
							info = 'mger Tran, Ordut.find, Error!';
							Err.usError(req, res, info);
						} else {
							res.render('./user/mger/tran/detail', {
								title: '运输单详情',
								crUser,
								tran,
								tranpds: tran.compds,

								strmlgs,
								duts
							})
						}
					})
				}
			})
		}
	})
}


exports.mgTranDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Tran.findOne({_id: id, firm: crUser.firm})
	.exec((err, tran) => {
		if(err) {
			console.log(err);
			info = "mger TranDel, Tran.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!tran) {
			info = "这个运输单已经被删除";
			Err.usError(req, res, info);
		} else if(tran.status != Conf.status.init.num) {
			info = "运输单状态已经改变, 不可删除";
			Err.usError(req, res, info);
		} else {
			Compd.countDocuments({
				_id: {"$in": tran.compds},
				compdSts: Conf.status.traning.num
			})
			.exec((err, count) => {
				if(err) {
					console.log(err);
					info = "mger TranPlusPd, Compd.find, Error!"
					Err.usError(req, res, info);
				} else if(count != tran.compds.length) {
					info = '运输单中的商品中状态已经改变, 不可删除';
					Err.usError(req, res, info);
				} else {
					Compd.updateMany({
						_id: {"$in": tran.compds},
						compdSts: Conf.status.traning.num
					}, {
						tran: null,
						compdSts: Conf.status.tranpre.num
					},(err, pdfirs) => {
						if(err) {
							console.log(err);
							info = "mger TranPlusPd, Compd.updateMany, Error!"
							Err.usError(req, res, info);
						} else {
							Tran.deleteOne({_id: id}, (err, objRm) => {
								if(err) {
									info = "user TranDel, Tran.deleteOne, Error!";
									Err.usError(req, res, info);
								} else {
									res.redirect("/mgTrans");
								}
							})
						}
					})
				}
			})
		}
	})
}



exports.mgTranPlusPd = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.body.id;
	let compdsArr = req.body.compds
	if(!compdsArr || compdsArr.length == 0) {
		info = '您需要选择添加的商品';
		Err.usError(req, res, info);
	} else {
		// 如果compdsArr不是数组 则变为数组
		if(compdsArr.constructor != Array) {
			compdsArr = [compdsArr];
		}
		Tran.findOne({
			firm: crUser.firm,
			_id: id
		}, (err, tran) => {
			if(err) {
				console.log(err);
				info = "mger TranPlusPd, Strmlg.findOne, Error!"
				Err.usError(req, res, info);
			} else if(!tran) {
				info = '此运输单已经被删除, 请刷新查看';
				Err.usError(req, res, info);
			} else {
				// console.log(tran)
				Compd.countDocuments({
					_id: {"$in": compdsArr},
					compdSts: Conf.status.tranpre.num
				})
				.exec((err, count) => {
					if(err) {
						console.log(err);
						info = "mger TranPlusPd, Compd.find, Error!"
						Err.usError(req, res, info);
					} else if(count != compdsArr.length) {	// 如果查看选中的商品中是否已经有改变状态的
						info = '选择的商品中存在已经改变状态的商品, 请刷新重试';
						Err.usError(req, res, info);
					} else {
						for(let i=0; i<compdsArr.length; i++) {
							tran.compds.push(compdsArr[i])
						}
						tran.save((err, tranSave) => {
							if(err) {
								console.log(err);
								info = "mger TranPlusPd, tran.save, Error!"
								Err.usError(req, res, info);
							} else {
								Compd.updateMany({
									_id: {"$in": compdsArr},
									compdSts: Conf.status.tranpre.num
								}, {
									tran: id,
									compdSts: Conf.status.traning.num
								},(err, pdfirs) => {
									if(err) {
										console.log(err);
										info = "mger TranPlusPd, Compd.updateMany, Error!"
										Err.usError(req, res, info);
									} else {
										res.redirect("/mgTran/"+id)
									}
								})
							}
						})
					}
				})
			}
		})
	}
}

exports.mgTranUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	Tran.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, tran) => {
		if(err) {
			console.log(err);
			info = "mger TranUpd, Tran.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!tran) {
			info = '此运输单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			mgerTranStrmlgSel(req, res, obj, tran);
		}
	})
}
let mgerTranStrmlgSel = (req, res, obj, tran) => {
	if(tran && (String(tran.strmlg) == String(obj.strmlg))) {
		// 如果是更新， 则判断如果 strmlg 没有变化, 则跳过此步骤
		mgertranSave(req, res, obj, tran);
	} else if(!obj.strmlg || obj.strmlg == '') {
		mgertranSave(req, res, obj, tran);
	} else {
		Compd.updateMany({
			_id: tran.compds,
			strmlg: tran.strmlg
		}, {
			strmlg: obj.strmlg
		},(err, compds) => {
			if(err) {
				console.log(err);
				info = "mger QuterSel, Compd.find(), Error!";
				Err.usError(req, res, info);
			} else {
				mgertranSave(req, res, obj, tran);
			}
		})
	}
}
let mgertranSave = (req, res, obj, tran) => {
	let _tran = Object();
	if(tran) {
		_tran = _.extend(tran, obj)
	} else {
		_tran = new Tran(obj)
	}
	_tran.save((err, objSave) => {
		if(err) {
			console.log(err);
			info = "添加运输单时 数据库保存错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			res.redirect('/mgTran/'+objSave._id)
		}
	})
}


exports.mgTranUpdAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	Tran.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, tran) => {
		if(err) {
			console.log(err);
			info = "mger TranUpd, Tran.findOne, Error!"
			Err.jsonErr(req, res, info);
		} else if(!tran) {
			info = '此运输单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			info = null;
			if(obj.nome) {
				obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			} else if(obj.trpDay) {
				obj.trpDay = parseInt(obj.trpDay);
				if(isNaN(obj.trpDay)) {
					info = "mger DinUpdAjax, 货期的天数 只能是数字"
				} else if(tran.trpAt){
					obj.arrivAt = (tran.trpAt).getTime() + obj.trpDay*24*60*60*1000
				} else {
					obj.arrivAt = null;
				}
			} else if(obj.trpAt) {
				obj.trpAt = new Date(obj.trpAt).setHours(8,0,0,0);
				if(tran.trpDay) {
					obj.arrivAt = obj.trpAt + tran.trpDay*24*60*60*1000
				} else {
					obj.arrivAt = null;
				}
			} else if(obj.crtAt) {
				obj.crtAt = new Date(obj.crtAt).setHours(8,0,0,0);
			}
			if(info) {
				Err.jsonErr(req, res, info);
			} else {
				let _tran = _.extend(tran, obj)
				_tran.save((err, objSave) => {
					if(err) {
						console.log(err);
						info = "添加订单时 数据库保存错误, 请截图后, 联系管理员";
						Err.jsonErr(req, res, info);
					} else {
						res.json({
							status: 1,
							msg: '',
							data: {
								tran: objSave
							}
						});
					}
				})
			}
		}
	})
}







exports.mgTranExcel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Tran.findOne({_id: id})
	.populate({
		path: 'compds', 
		options: { sort: { 'qntpdSts': 1, 'updAt': -1 } },
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},
		]
	})
	.exec((err, tran) => {
		if(err) {
			console.log(err);
			info = "sler Tran, Tran.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!tran) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(tran)
			let wb = new xl.Workbook({
				defaultFont: {
					size: 12,
					color: '333333'
				},
				dateFormat: 'yyyy-mm-dd hh:mm:ss'
			});
			
			let ws = wb.addWorksheet('Sheet 1');
			ws.column(1).setWidth(5);
			ws.column(2).setWidth(15);
			ws.column(3).setWidth(10);
			ws.column(4).setWidth(20);
			ws.column(5).setWidth(20);
			ws.column(6).setWidth(15);
			ws.column(7).setWidth(10);
			ws.column(8).setWidth(15);
			ws.column(9).setWidth(10);
			ws.column(10).setWidth(10);
			ws.column(11).setWidth(10);

			// header
			ws.cell(1,1).string('NB.');
			ws.cell(1,2).string('Brand');
			ws.cell(1,3).string('Area');
			ws.cell(1,4).string('Product');
			ws.cell(1,5).string('code规格');
			ws.cell(1,6).string('material');
			ws.cell(1,7).string('craft');
			ws.cell(1,8).string('Note');
			ws.cell(1,9).string('Qunant');

			let compds = tran.compds;

			let totQuant = 0;
			let i=0;
			for(; i<compds.length; i++){
				ws.cell((i+2), 1).string(String(i+1));

				let compd = compds[i];
				if(compd.brand) {
					ws.cell((i+2), 2).string(String(compd.brand.nome));
				} else if(compd.brandNome) {
					ws.cell((i+2), 2).string(String(compd.brandNome));
				}

				if(compd.area) ws.cell((i+2), 3).string(String(compd.area));

				if(compd.pdfir) {
					// ws.addImage({
					// 	path: compd.pdfir.photo,
					// 	type: 'picture',
					// 	position: {
					// 		type: 'oneCellAnchor',
					// 		from: {
					// 			col: i+2,
					// 			colOff: '0.5in',
					// 			row: 3,
					// 			rowOff: 0,
					// 		},
					// 	},
					// });
					ws.cell((i+2), 4).string(String(compd.pdfir.code));
				} else if(compd.firNome) {
					ws.cell((i+2), 4).string(String(compd.firNome));
				}
				if(compd.pdsec) {
					ws.cell((i+2), 5).string("产品编号:" + String(compd.pdsec.code));
					ws.cell((i+2), 5).string("规格尺寸:" +String(compd.pdsec.spec));
				} else if(compd.firNome) {
					ws.cell((i+2), 5).string(String(compd.firNome));
					ws.cell((i+2), 5).string(String(compd.specf));
				}
				if(compd.pdthd) {
					let maters = '';
					for(let j=0; j<compd.pdthd.maters.length; j++){
						maters += compd.pdthd.maters[j] + ' ';
					}
					ws.cell((i+2), 6).string(maters);
					let crafts = '';
					for(let j=0; j<compd.pdthd.crafts.length; j++){
						crafts += compd.pdthd.crafts[j] + ' ';
					}
					ws.cell((i+2), 7).string(crafts);
				} else if(compd.thdNome) {
					ws.cell((i+2), 6).string(String(compd.mater));
					ws.cell((i+2), 7).string(String(compd.craft));
				}

				if(compd.note) ws.cell((i+2), 8).string(String(compd.note));

				if(compd.quant) {
					let quant = parseInt(compd.quant);
					totQuant += quant;
					ws.cell((i+2), 9).string(String(quant));
				}
			}
			i++;
			ws.cell((i+2), 11).string(String(totQuant))
			wb.write('Order_out'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
		}
	})
}