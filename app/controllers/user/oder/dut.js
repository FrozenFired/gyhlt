// 采购单
const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Ordut = require('../../../models/firm/ord/ordut');
const Compd = require('../../../models/firm/ord/compd');

const Ordin = require('../../../models/firm/ord/ordin');
const Strmup = require('../../../models/firm/stream/strmup');

const _ = require('underscore');

const moment = require('moment');
const xl = require('excel4node');

// 采购单
exports.odDuts = (req, res) => {
	let crUser = req.session.crUser;
	Strmup.find({firm: crUser.firm})
	.exec((err, strmups) => {
		if(err) {
			console.log(err);
			info = "oder Duts, Strmup.find, Error!"
		} else {
			res.render('./user/oder/order/dut/list', {
				title: '采购单',
				crUser,
				strmups
			})
		}
	})
}

exports.odDutNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	
	let maxNum = 3
	let minNum = 1
	let r1 = parseInt(Math.random()*(maxNum-minNum+1)+minNum,10)
	let r2 = parseInt(Math.random()*(maxNum-minNum+1)+minNum,10)

	let symAtFm = "$gte";
	var monthStart = new Date(); //本月
	let today = monthStart.getDate();
	let codePre = moment(monthStart).format("YYMM");
	monthStart.setDate(1);
	monthStart.setHours(0);
	monthStart.setSeconds(0);
	monthStart.setMinutes(0);

	Ordut.findOne({
		'firm': crUser.firm,
		'crtAt': {[symAtFm]: monthStart}
	})
	.sort({'crtAt': -1})
	.exec((err, lastOrdut) => {
		if(err) {
			console.log(err);
			info = "oder DutNew, Ordut.findOne, Error!";
			Err.usError(req, res, info);
		} else {
			let lastDate = monthStart.getDate();
			let codeNum = 0;
			if(lastOrdut) {
				lastDate = lastOrdut.crtAt.getDate();
				codeNum = (lastOrdut.code).split('GYIP')[1];
			}
			let daySpan = parseInt(today) - parseInt(lastDate);
			codeNum = String(parseInt(codeNum) + daySpan * r1 + r2);

			if(codeNum.length < 4) {
				for(let i=codeNum.length; i < 4; i++) { // 序列号补0
					codeNum = "0"+codeNum;
				}
			}
			let code = codePre + 'GYIP' + codeNum;
			obj.firm = crUser.firm;
			obj.duter = crUser._id;
			obj.code = code;
			_ordut = new Ordut(obj)
			_ordut.save((err, ordutSave) => {
				if(err) {
					console.log(err);
					info = "oder DutNew, _ordut.save, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect('/odDut/'+ordutSave._id);
				}
			})
		}
	})
}


exports.odDut = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Ordut.findOne({_id: id})
	.populate('duter')
	.populate('strmup')
	.populate('bills')
	.populate({
		path: 'compds',
		options: { sort: { 'ordin': 1, 'pdnum': 1 } },
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},

			{path: 'ordin'},
			{path: 'tran'},
		]
	})
	.exec((err, dut) => {
		if(err) {
			console.log(err);
			info = "oder Dut, Ordut.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dut) {
			info = "这个采购单已经被删除, odDutFilter";
			Err.usError(req, res, info);
		} else {
			// console.log(dut)
			Strmup.find({
				firm: crUser.firm,
			})
			.sort({'role': -1})
			.exec((err, strmups) => {
				if(err) {
					console.log(err);
					info = 'oder Dut, Strmup.find, Error!';
					Err.usError(req, res, info);
				} else {
					Ordin.find({
						firm: crUser.firm,
						status: {'$in': [Conf.status.deposit.num, Conf.status.payoff.num]},
					})
					.populate('diner')
					.populate({
						path: 'compds',
						match: { 'compdSts': Conf.status.waiting.num, 'strmup': dut.strmup },
						populate: [
							{path: 'brand'},
							{path: 'pdfir'},
							{path: 'pdsec'},
							{path: 'pdthd'},

							{path: 'strmup'},
							{path: 'cter'},
						]
					})
					.exec((err, dins) => {
						if(err) {
							console.log(err);
							info = 'oder Dut, Ordin.find, Error!';
							Err.usError(req, res, info);
						} else {
							res.render('./user/oder/order/dut/detail', {
								title: '采购单详情',
								crUser,
								dut,
								dutpds: dut.compds,

								strmups,
								dins
							})
						}
					})
				}
			})
		}
	})
}


exports.odDutDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Ordut.findOne({_id: id, firm: crUser.firm})
	.populate('bills')
	.exec((err, ordut) => {
		if(err) {
			console.log(err);
			info = "oder DutDel, Ordut.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!ordut) {
			info = "这个采购单已经被删除";
			Err.usError(req, res, info);
		} else if(ordut.status != Conf.status.init.num) {
			info = "采购单状态已经改变, 不可删除";
			Err.usError(req, res, info);
		} else if(ordut.bills.length > 0) {
			info = "此采购单已经付款, 不可删除";
			Err.usError(req, res, info);
		} else {
			Compd.countDocuments({
				_id: {"$in": ordut.compds},
				compdSts: Conf.status.proding.num
			})
			.exec((err, count) => {
				if(err) {
					console.log(err);
					info = "oder DutPlusPd, Compd.find, Error!"
					Err.usError(req, res, info);
				} else if(count != ordut.compds.length) {
					info = '采购单中的商品中状态已经改变, 不可删除';
					Err.usError(req, res, info);
				} else {
					Compd.updateMany({
						_id: {"$in": ordut.compds},
						compdSts: Conf.status.proding.num
					}, {
						ordut: null,
						compdSts: Conf.status.waiting.num
					},(err, pdfirs) => {
						if(err) {
							console.log(err);
							info = "oder DutPlusPd, Compd.updateMany, Error!"
							Err.usError(req, res, info);
						} else {
							Ordut.deleteOne({_id: id}, (err, objRm) => {
								if(err) {
									info = "user OrdutDel, Ordut.deleteOne, Error!";
									Err.usError(req, res, info);
								} else {
									res.redirect("/odDuts");
								}
							})
						}
					})
				}
			})
		}
	})
}



exports.odDutPlusPd = (req, res) => {
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
		Ordut.findOne({
			firm: crUser.firm,
			_id: id
		}, (err, ordut) => {
			if(err) {
				console.log(err);
				info = "oder DutPlusPd, Strmup.findOne, Error!"
				Err.usError(req, res, info);
			} else if(!ordut) {
				info = '此采购单已经被删除, 请刷新查看';
				Err.usError(req, res, info);
			} else {
				// console.log(ordut)
				Compd.countDocuments({
					_id: {"$in": compdsArr},
					compdSts: Conf.status.waiting.num
				})
				.exec((err, count) => {
					if(err) {
						console.log(err);
						info = "oder DutPlusPd, Compd.find, Error!"
						Err.usError(req, res, info);
					} else if(count != compdsArr.length) {	// 如果查看选中的商品中是否已经有改变状态的
						info = '选择的商品中存在已经改变状态的商品, 请刷新重试';
						Err.usError(req, res, info);
					} else {
						for(let i=0; i<compdsArr.length; i++) {
							ordut.compds.push(compdsArr[i])
						}
						ordut.save((err, ordutSave) => {
							if(err) {
								console.log(err);
								info = "oder DutPlusPd, ordut.save, Error!"
								Err.usError(req, res, info);
							} else {
								Compd.updateMany({
									_id: {"$in": compdsArr},
									compdSts: Conf.status.waiting.num
								}, {
									ordut: id,
									compdSts: Conf.status.proding.num
								},(err, pdfirs) => {
									if(err) {
										console.log(err);
										info = "oder DutPlusPd, Compd.updateMany, Error!"
										Err.usError(req, res, info);
									} else {
										res.redirect("/odDut/"+id)
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

exports.odDutUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	Ordut.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, ordut) => {
		if(err) {
			console.log(err);
			info = "oder DutUpd, Ordut.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!ordut) {
			info = '此采购单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			oderDutStrmupSel(req, res, obj, ordut);
		}
	})
}
let oderDutStrmupSel = (req, res, obj, ordut) => {
	if(ordut && (String(ordut.strmup) == String(obj.strmup))) {
		// 如果是更新， 则判断如果 strmup 没有变化, 则跳过此步骤
		oderdutSave(req, res, obj, ordut);
	} else if(!obj.strmup || obj.strmup == '') {
		oderdutSave(req, res, obj, ordut);
	} else {
		Compd.updateMany({
			_id: ordut.compds,
			strmup: ordut.strmup
		}, {
			strmup: obj.strmup
		},(err, compds) => {
			if(err) {
				console.log(err);
				info = "oder QuterSel, Compd.find(), Error!";
				Err.usError(req, res, info);
			} else {
				oderdutSave(req, res, obj, ordut);
			}
		})
	}
}
let oderdutSave = (req, res, obj, ordut) => {
	let _ordut = Object();
	if(ordut) {
		_ordut = _.extend(ordut, obj)
	} else {
		_ordut = new Ordut(obj)
	}
	_ordut.save((err, objSave) => {
		if(err) {
			console.log(err);
			info = "oderdutSave 保存采购单时 数据库保存错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			res.redirect('/odDut/'+objSave._id)
		}
	})
}











exports.odDutExcel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Ordut.findOne({_id: id})
	.populate({
		path: 'compds', 
		options: { sort: { 'qntpdSts': 1, 'qntupdAt': -1 } },
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},

			{path: 'quner'},
		]
	})
	.exec((err, dut) => {
		if(err) {
			console.log(err);
			info = "sler Dut, Ordut.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dut) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(dut)
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
			ws.cell(1,9).string('Dutant');
			ws.cell(1,10).string('销售价格(€)');
			ws.cell(1,11).string('Total Price(€)');

			let compds = dut.compds;

			let dutPrImp = 0;
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
					ws.cell((i+2), 9).string(String(quant));

					if(compd.dutPr && !isNaN(parseFloat(compd.dutPr))) {
						let dutPr = parseFloat(compd.dutPr);
						ws.cell((i+2), 10).string(String(dutPr + ' €'));
						if(!isNaN(dutPr) && !isNaN(quant)) {
							let tot = dutPr * quant;
							dutPrImp += tot;
							ws.cell((i+2), 11).string(String(tot + ' €'));
						}
					}
				}
			}
			i++;
			ws.cell((i+2), 11).string(String(dutPrImp+ ' €'))
			wb.write('Order_out'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
		}
	})
}