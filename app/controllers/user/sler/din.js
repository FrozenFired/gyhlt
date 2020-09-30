// 销售订单
const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Ordin = require('../../../models/firm/ord/ordin');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const Strmdw = require('../../../models/firm/stream/strmdw');
const User = require('../../../models/login/user');

const _ = require('underscore');

const moment = require('moment');
const xl = require('excel4node');


// 订单
exports.slDins = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/sler/ordin/din/list', {
		title: '销售订单',
		crUser,
	})
}


exports.slDin = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Ordin.findOne({_id: id})
	.populate('diner')
	.populate('cter')
	.populate({
		path: 'compds',
		options: { sort: { 'pdnum': 1,} },
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},
			{path: 'diner'},
			{path: 'cter'},
		]
	})
	.exec((err, din) => {
		if(err) {
			console.log(err);
			info = "sler Qun, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!din) {
			info = "这个订单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(din)
			res.render('./user/sler/ordin/din/detail', {
				title: '订单详情',
				crUser,
				din,
				dinpds: din.compds,
			})
		}
	})
}

exports.slDinUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	if(!obj.nstrmup || obj.nstrmup.length == 0) obj.nstrmup = null;
	if(!obj.cter || obj.cter.length == 0) obj.cter = null;
	if(obj.cterNome) obj.cterNome = obj.cterNome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Ordin.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, ordin) => {
		if(err) {
			console.log(err);
			info = "sler QunUpd, Strmup.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!ordin) {
			info = '此订单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			slerDinNstrmupSel(req, res, obj, ordin);
		}
	})
}
let slerDinNstrmupSel = (req, res, obj, ordin) => {
	if(ordin && (String(ordin.nstrmup) == obj.nstrmup)) {
		// 如果是更新， 则判断如果nstrmup没有变化, 则跳过此步骤
		slerDinCterSel(req, res, obj, ordin);
	} else {
		let crUser = req.session.crUser;
		if(!obj.nstrmup || obj.nstrmup.length < 20) {
			// 说明本订单的 合作报价公司为 本公司， 以询价视角看供应商公司为null, 以报价视角看下游客户公司为null
			obj.nstrmup = null;
			obj.tstrmdw = null;
			obj.dutFirm = crUser.firm;
			slerDinCterSel(req, res, obj, ordin);
		} else {
			// 如果订单的上游公司不为空, 就要看上游报价公司是否在本平台, 并且是否和本公司建立联系
			Strmup.findOne({
				firm: crUser.firm,
				_id: obj.nstrmup
			}, (err, nstrmup) => {
				if(err) {
					console.log(err);
					info = "sler QunNew, Strmup.findOne, Error!"
					Err.usError(req, res, info);
				} else if(!nstrmup) {	// 本公司数据库中没有此供应商
					info = "本公司数据库中没有此供应商! "
					Err.usError(req, res, info);
				} else if(nstrmup.accept != Conf.accept.yes.num) {
					// 如果询价公司没有跟上游报价公司建立联系
					obj.dutFirm = null;
					obj.tstrmdw = null;
					slerDinCterSel(req, res, obj, ordin);
				} else {
					// 如果询价公司和报价公司建立了联系
					obj.dutFirm = nstrmup.firmUp;
					Strmdw.findOne({
						firm: obj.dutFirm,
						firmDw: crUser.firm
					}, (err, tstrmdw) => {
						if(err) {
							console.log(err);
							info = "sler QunNew, Strmup.findOne, Error!"
							Err.usError(req, res, info);
						} else if(!tstrmdw){
							info = "对方没有跟我们建立联系, 请联系对方公司! "
							Err.usError(req, res, info);
						} else {
							obj.tstrmdw = tstrmdw._id;
							slerDinCterSel(req, res, obj, ordin);
						}
					})
				}
			})
		}
	}
}
let slerDinCterSel = (req, res, obj, ordin) => {
	let crUser = req.session.crUser;
	obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

	let cterSel = req.body.cterSel
	if(cterSel == 'cterNome') {
		obj.cter = null;
		slerdinSave(req, res, obj, ordin);
	} else if(cterSel == 'cter') {
		if(ordin && (String(ordin.cter) == obj.cter)) {
			slerdinSave(req, res, obj, ordin);
		} else {
			User.findOne({
				firm: crUser.firm,
				_id: obj.cter
			}, (err, cter) => {
				if(err) {
					console.log(err);
					info = "sler QunNew, User.findOne, Error!"
					Err.usError(req, res, info);
				} else if(!cter) {
					info = "您选的客户不存在! "
					Err.usError(req, res, info);
				} else {
					obj.cterNome = cter.nome + ' ' + [cter.code]
					slerdinSave(req, res, obj, ordin);
				}
			})
		}
	}
}
let slerdinSave = (req, res, obj, ordin) => {
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
			res.redirect('/slDin/'+objSave._id)
		}
	})
}

exports.slDinExcel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Ordin.findOne({_id: id})
	.populate('firm')
	.populate('diner')
	.populate('duter')
	.populate('tstrmdw')
	.populate('tstrmup')
	.exec((err, din) => {
		if(err) {
			console.log(err);
			info = "sler Qun, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!din) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(din)
			Compd.find({ordin: id})
			.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
			.sort({'status': 1, 'dinAt': -1})
			.exec((err, dinpds) => {
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

					for(let i=0; i<dinpds.length; i++){
						ws.cell((i+2), 1).string(String(i+1));
						let dinpd = dinpds[i];
						if(dinpd.brand) {
							ws.cell((i+2), 2).string(String(dinpd.brand.nome));
						} else if(dinpd.brandNome) {
							ws.cell((i+2), 2).string(String(dinpd.brandNome));
						}
						if(dinpd.pdfir) {
							// ws.addImage({
							// 	path: dinpd.pdfir.photo,
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
							ws.cell((i+2), 3).string(String(dinpd.pdfir.code));
						} else if(dinpd.firNome) {
							ws.cell((i+2), 3).string(String(dinpd.firNome));
						}
						if(dinpd.pdsec) {
							ws.cell((i+2), 4).string(String(dinpd.pdsec.code));
						} else if(dinpd.firNome) {
							ws.cell((i+2), 4).string(String(dinpd.firNome));
						}
						if(dinpd.pdthd) {
							let maters = '';
							for(let j=0; j<dinpd.pdthd.maters.length; j++){
								maters += dinpd.pdthd.maters[j] + ' ';
							}
							ws.cell((i+2), 5).string(maters);
						} else if(dinpd.thdNome) {
							ws.cell((i+2), 5).string(String(dinpd.thdNome));
						}

						if(dinpd.price && dinpd.quant) {
							let price = parseFloat(dinpd.price);
							let quant = parseInt(dinpd.quant);
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