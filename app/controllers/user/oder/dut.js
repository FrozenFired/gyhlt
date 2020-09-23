// 销售订单
const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Compd = require('../../../models/firm/ord/compd');
const Inquot = require('../../../models/firm/ord/inquot');
const Ordin = require('../../../models/firm/ord/ordin');

const Strmup = require('../../../models/firm/stream/strmup');
const Strmdw = require('../../../models/firm/stream/strmdw');
const User = require('../../../models/login/user');

const _ = require('underscore');

const moment = require('moment');
const xl = require('excel4node');

exports.odDutGen = (req, res) => {
	let crUser = req.session.crUser;
	let inquotId = req.params.inquotId;
	Inquot.findOne({_id: inquotId})
	.exec((err, inquot) => {
		if(err) {
			console.log(err);
			info = 'oderDutGen, Inquot.findOne, Error!'
			Err.usError(req, res, info);
		} else if(!inquot) {
			info = '没有找到询价单, 请重试!'
			Err.usError(req, res, info);
		} else {
			let dateCd = moment(Date.now()).format('YYMM')+crUser.firm.code
			Ordin.countDocuments({
				firm: crUser.firm,
				'dateCd': dateCd
			}, (err, count) => {
				if(err) console.log(err);
				let today = moment(Date.now()).format('DD')
				let code = ((parseInt(today[0])+5)*parseInt(today[1])) + String(count+1)
				let ordinObj = new Object();
				ordinObj.inquot = inquot._id;
				if(inquot.quner) ordinObj.duter = inquot.quner
				ordinObj.dutAt = ordinObj.dutAt = Date.now()
				if(inquot.cter) ordinObj.cter = inquot.cter
				ordinObj.cterNome = inquot.cterNome
				if(inquot.strmup) ordinObj.strmup = inquot.strmup
				if(inquot.quter) ordinObj.duter = inquot.quter
				if(inquot.tstrmdw) ordinObj.tstrmdw = inquot.tstrmdw
				if(inquot.tstrmup) ordinObj.tstrmup = inquot.tstrmup

				ordinObj.dateCd = dateCd;
				ordinObj.code = code;
				_ordin = new Ordin(ordinObj)
				_ordin.save((err, ordSave) => {
					if(err) {
						console.log(err);
						info = '没有找到询价单, 请重试!'
						Err.usError(req, res, info);
					} else {
						inquot.status = Conf.status.ord.num;
						inquot.save((err, inquotSave) => {
							if(err) console.log(err);
							res.redirect('/odQunGenDut?inquotId='+inquotId+'&ordinId='+ordSave._id)
						})
					}
				})
			})
		}
	})
}

exports.odDutFilter = (req, res, next) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	if(!id) id = req.query.ordinId
	if(!id) {
		let dutObj = {
			dut: new Object(),
			dutpds: new Object()
		}
		req.body.dutObj = dutObj;
		next();
	} else {
		Ordin.findOne({_id: id})
		.populate('duter')
		.populate('cter')
		.populate('firm')
		.populate('strmup')
		.exec((err, dut) => {
			if(err) {
				console.log(err);
				info = "oder Qun, Inquot.findOne, Error!";
				Err.usError(req, res, info);
			} else if(!dut) {
				info = "这个询价单已经被删除, odDutFilter";
				Err.usError(req, res, info);
			} else {
				// console.log(dut)
				Compd.find({ordin: id})
				.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
				.populate('duter')
				.populate('cter')
				.populate('firm').populate('strmup')
				.sort({'status': 1, 'weight': -1, 'dutAt': -1})
				.exec((err, dutpds) => {
					if(err) {
						info = "cter CompdsAjax, Compd.find(), Error!";
						Err.usError(req, res, info);
					} else {
						let dutObj = {
							dut,
							dutpds,
						}
						req.body.dutObj = dutObj;
						next();
					}
				})
			}
		})
	}
}




// 订单
exports.odDuts = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/oder/ordin/dut/list', {
		title: '销售订单',
		crUser,
	})
}


exports.odDut = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Ordin.findOne({_id: id})
	.populate('duter')
	.populate('cter')
	.populate('firm')
	.populate('strmup')
	.exec((err, dut) => {
		if(err) {
			console.log(err);
			info = "oder Qun, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dut) {
			info = "这个订单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(dut)
			Compd.find({ordin: id})
			.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
			.populate('duter')
			.populate('cter')
			.populate('firm').populate('strmup')
			.sort({'status': 1, 'weight': -1, 'dutAt': -1})
			.exec((err, dutpds) => {
				if(err) {
					info = "cter CompdsAjax, Compd.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					res.render('./user/oder/ordin/dut/detail', {
						title: '订单详情',
						crUser,
						dut,
						dutpds,
					})
				}
			})
		}
	})
}
exports.odDutUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Ordin.findOne({_id: id})
	.exec((err, dut) => {
		if(err) {
			console.log(err);
			info = "oder Qun, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dut) {
			info = "此订单已经被删除";
			Err.usError(req, res, info);
		} else if(dut.status != Conf.status.init.num){
			info = "此订单不能被修改, 请联系报价员修改";
			Err.usError(req, res, info);
		} else {
			// console.log(dut)
			Strmup.find({firm: crUser.firm})
			.sort({'weight': -1})
			.exec((err, strmups) => {
				if(err) {
					console.log(err);
					info = 'oder QunAdd, Strmup.find, Error!'
					Err.usError(req, res, info);
				} else {
					User.find({firm: crUser.firm, role: Conf.roleUser.customer.num})
					.sort({'weight': -1})
					.exec((err, cters) => {
						if(err) {
							console.log(err);
							info = 'oder QunAdd, User.find, Error!';
							Err.usError(req, res, info);
						} else {
							res.render('./user/oder/ordin/dut/update', {
								title: '订单修改',
								crUser,
								dut,

								strmups,
								cters
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

	Ordin.findOne({_id: id})
	.exec((err, ordin) => {
		if(err) {
			console.log(err);
			info = "oder QunDel, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!ordin) {
			info = "这个订单已经被删除";
			Err.usError(req, res, info);
		} else {
			if(ordin.compds.length > 0) {
				info = "安全起见, 请先删除此单中的询价货物!";
				Err.usError(req, res, info);
			} else {
				Ordin.deleteOne({_id: id}, (err, objRm) => {
					if(err) {
						info = "user OrdinDel, Ordin.deleteOne, Error!";
						Err.usError(req, res, info);
					} else {
						res.redirect("/odDuts");
					}
				})
			}
		}
	})
}







exports.odDutUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	if(!obj.strmup || obj.strmup.length == 0) obj.strmup = null;
	if(!obj.cter || obj.cter.length == 0) obj.cter = null;
	if(obj.cterNome) obj.cterNome = obj.cterNome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Ordin.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, ordin) => {
		if(err) {
			console.log(err);
			info = "oder QunUpd, Strmup.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!ordin) {
			info = '此订单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			oderDutNstrmupSel(req, res, obj, ordin);
		}
	})
}
let oderDutNstrmupSel = (req, res, obj, ordin) => {
	if(ordin && (String(ordin.strmup) == obj.strmup)) {
		// 如果是更新， 则判断如果strmup没有变化, 则跳过此步骤
		oderDutCterSel(req, res, obj, ordin);
	} else {
		let crUser = req.session.crUser;
		if(!obj.strmup || obj.strmup.length < 20) {
			// 说明本订单的 合作报价公司为 本公司， 以询价视角看供应商公司为null, 以报价视角看下游客户公司为null
			obj.strmup = null;
			obj.firm = crUser.firm;
			oderDutCterSel(req, res, obj, ordin);
		} else {
			// 如果订单的上游公司不为空, 就要看上游报价公司是否在本平台, 并且是否和本公司建立联系
			Strmup.findOne({
				firm: crUser.firm,
				_id: obj.strmup
			}, (err, strmup) => {
				if(err) {
					console.log(err);
					info = "oder QunNew, Strmup.findOne, Error!"
					Err.usError(req, res, info);
				} else if(!strmup) {	// 本公司数据库中没有此供应商
					info = "本公司数据库中没有此供应商! "
					Err.usError(req, res, info);
				} else if(strmup.accept != Conf.accept.yes.num) {
					// 如果询价公司没有跟上游报价公司建立联系
					obj.firm = null;
					oderDutCterSel(req, res, obj, ordin);
				} else {
					// 如果询价公司和报价公司建立了联系
					obj.firm = strmup.firmUp;
					Strmdw.findOne({
						firm: obj.firm,
						firmDw: crUser.firm
					}, (err, tstrmdw) => {
						if(err) {
							console.log(err);
							info = "oder QunNew, Strmup.findOne, Error!"
							Err.usError(req, res, info);
						} else if(!tstrmdw){
							info = "对方没有跟我们建立联系, 请联系对方公司! "
							Err.usError(req, res, info);
						} else {
							obj.tstrmdw = tstrmdw._id;
							oderDutCterSel(req, res, obj, ordin);
						}
					})
				}
			})
		}
	}
}
let oderDutCterSel = (req, res, obj, ordin) => {
	let crUser = req.session.crUser;
	obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

	let cterSel = req.body.cterSel
	if(cterSel == 'cterNome') {
		obj.cter = null;
		oderdutSave(req, res, obj, ordin);
	} else if(cterSel == 'cter') {
		if(ordin && (String(ordin.cter) == obj.cter)) {
			oderdutSave(req, res, obj, ordin);
		} else {
			User.findOne({
				firm: crUser.firm,
				_id: obj.cter
			}, (err, cter) => {
				if(err) {
					console.log(err);
					info = "oder QunNew, User.findOne, Error!"
					Err.usError(req, res, info);
				} else if(!cter) {
					info = "您选的客户不存在! "
					Err.usError(req, res, info);
				} else {
					obj.cterNome = cter.nome + ' ' + [cter.code]
					oderdutSave(req, res, obj, ordin);
				}
			})
		}
	}
}
let oderdutSave = (req, res, obj, ordin) => {
	let _ordin = Object();
	if(ordin) {
		_ordin = _.extend(ordin, obj)
	} else {
		_ordin = new Ordin(obj)
	}
	_ordin.save((err, objSave) => {
		if(err) {
			console.log(err);
			info = "添加订单时 数据库保存错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			res.redirect('/odDut/'+objSave._id)
		}
	})
}

exports.odDutExcel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Ordin.findOne({_id: id})
	.populate('firm')
	.populate('duter')
	.populate('duter')
	.populate('strmup')
	.exec((err, dut) => {
		if(err) {
			console.log(err);
			info = "oder Qun, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dut) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(dut)
			Compd.find({ordin: id})
			.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
			.sort({'status': 1, 'dutAt': -1})
			.exec((err, dutpds) => {
				if(err) {
					info = "cter CompdsAjax, Compd.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
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
					ws.column(3).setWidth(20);
					ws.column(4).setWidth(20);
					ws.column(5).setWidth(20);
					ws.column(6).setWidth(15);
					ws.column(7).setWidth(10);
					ws.column(8).setWidth(20);
					
					// header
					ws.cell(1,1).string('NB.');
					ws.cell(1,2).string('Brand');
					ws.cell(1,3).string('Product');
					ws.cell(1,4).string('Code');
					ws.cell(1,5).string('Specif');
					ws.cell(1,6).string('Price Unit');
					ws.cell(1,7).string('Qunant');
					ws.cell(1,8).string('Total');

					for(let i=0; i<dutpds.length; i++){
						ws.cell((i+2), 1).string(String(i+1));
						let dutpd = dutpds[i];
						if(dutpd.brand) {
							ws.cell((i+2), 2).string(String(dutpd.brand.nome));
						} else if(dutpd.brandNome) {
							ws.cell((i+2), 2).string(String(dutpd.brandNome));
						}
						if(dutpd.pdfir) {
							// ws.addImage({
							// 	path: dutpd.pdfir.photo,
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
							ws.cell((i+2), 3).string(String(dutpd.pdfir.code));
						} else if(dutpd.firNome) {
							ws.cell((i+2), 3).string(String(dutpd.firNome));
						}
						if(dutpd.pdsec) {
							ws.cell((i+2), 4).string(String(dutpd.pdsec.code));
						} else if(dutpd.firNome) {
							ws.cell((i+2), 4).string(String(dutpd.firNome));
						}
						if(dutpd.pdthd) {
							let maters = '';
							for(let j=0; j<dutpd.pdthd.maters.length; j++){
								maters += dutpd.pdthd.maters[j] + ' ';
							}
							ws.cell((i+2), 5).string(maters);
						} else if(dutpd.thdNome) {
							ws.cell((i+2), 5).string(String(dutpd.thdNome));
						}

						if(dutpd.price && dutpd.quant) {
							let price = parseFloat(dutpd.price);
							let quant = parseInt(dutpd.quant);
							ws.cell((i+2), 6).string(String(price + ' €'));
							ws.cell((i+2), 7).string(String(quant));
							if(!isNaN(price) && !isNaN(quant)) {
								let tot = price * quant;
								ws.cell((i+2), 8).string(String(tot + ' €'));
							}
						}
					}

					wb.write('SaleOrdin_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
				}
			})
		}
	})
}