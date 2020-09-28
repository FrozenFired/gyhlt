const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const _ = require('underscore');

const moment = require('moment');
const xl = require('excel4node');

// 询价单
exports.slQuns = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/sler/inquot/qun/list', {
		title: '询价单',
		crUser,
	})
}

exports.slQunFilter = (req, res, next) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	if(!id) id = req.query.inquotId

	Inquot.findOne({_id: id})
	// .populate('firm')
	.populate('quner')
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
	.exec((err, qun) => {
		if(err) {
			console.log(err);
			info = "sler Qun, Inquot.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qun) {
			info = "这个询价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(qun)
			let qunObj = {
				qun,
				qunpds: qun.compds
			}
			req.body.qunObj = qunObj;
			next();
		}
	})
}
exports.slQun = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.qunObj;
	let qun = obj.qun;
	let qunpds = obj.qunpds;

	res.render('./user/sler/inquot/qun/detail', {
		title: '询价单详情',
		crUser,
		qun,
		qunpds,
	})
}


exports.slQunDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Inquot.findOne({_id: id})
	.populate('compds')
	.exec((err, inquot) => {
		if(err) {
			console.log(err);
			info = "sler QunDel, Inquot.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!inquot) {
			info = "这个询价单已经被删除";
			Err.usError(req, res, info);
		} else if(inquot.status != Conf.status.init.num){
			info = "这个询价单已提交不可删除";
			Err.usError(req, res, info);
		} else {
			let picDels = new Array();
			for(let i=0; i<inquot.compds.length; i++) {
				let compd = inquot.compds[i];
				if(compd.photo) picDels.push(compd.photo)
				if(compd.sketch) picDels.push(compd.sketch)
				for(let j=0; j<compd.images.length; j++) {
					if(compd.images[j]) picDels.push(compd.images[j]);
				}
			}
			Compd.deleteMany({'_id': {"$in": inquot.compds}}, function(err, compdDel) {
				if(err) {
					info = "sler QunDel, Compd.deleteMany, Error!";
					Err.usError(req, res, info);
				} else {
					for(let i = 0; i<picDels.length; i++) {
						MdPicture.deletePicture(picDels[i], Conf.picPath.compd);
					}
					Inquot.deleteOne({_id: id}, (err, objRm) => {
						if(err) {
							info = "user InquotDel, Inquot.deleteOne, Error!";
							Err.usError(req, res, info);
						} else {
							res.redirect("/slQuns");
						}
					})
				}
			})
		}
	})
}







exports.slQunNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	obj.quner = crUser._id;
	obj.qntcrtAt = obj.qntupdAt = Date.now();
	obj.status = Conf.status.init.num;

	let now = new Date();
	let year = now.getFullYear();
	let initYear = year+"-01-01 00:00:00";
	let initDate = new Date(initYear);
	Inquot.find({
		firm: crUser.firm,
		quner: crUser._id,
		qntcrtAt: {"$gte": initDate},
	}, (err, inquots) => {
		if(err) {
			console.log(err);
			info = "sler QunNew Inquot.find, Error!";
			Err.usError(req, res, info);
		} else {
			let len = String(inquots.length+1);
			if(len.length < 4) {
				for(let i=len.length; i < 4; i++) { // 序列号补0
					len = "0"+len;
				}
			}
			obj.code = year+crUser.code+len;
			if(obj.cterNome) obj.cterNome = obj.cterNome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			let _inquot = new Inquot(obj)

			_inquot.save((err, objSave) => {
				if(err) {
					console.log(err);
					info = "sler QunNew _inquot.save, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect('/slQun/'+objSave._id)
				}
			})
		}
	})
}

exports.slQunUpdAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.qntupdAt = Date.now();
	Inquot.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, inquot) => {
		if(err) {
			console.log(err);
			info = "sler QunUpd, Inquot.findOne, Error!"
			Err.jsonErr(req, res, info);
		} else if(!inquot) {
			info = '此询价单已经被删除, 请刷新查看';
			Err.jsonErr(req, res, info);
		} else {
			if(obj.cterNome) obj.cterNome = obj.cterNome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
			let _inquot = _.extend(inquot, obj)
			_inquot.save((err, objSave) => {
				if(err) {
					console.log(err);
					info = "添加询价单时 数据库保存错误, 请截图后, 联系管理员";
					Err.jsonErr(req, res, info);
				} else {
					res.json({
						status: 1,
						msg: '',
						data: {}
					});
				}
			})
		}
	})
}


exports.slQunExcel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Inquot.findOne({_id: id})
	.populate('firm')
	.exec((err, qun) => {
		if(err) {
			console.log(err);
			info = "sler Qun, Inquot.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qun) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(qun)
			Compd.find({inquot: id})
			.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
			.sort({'status': 1, 'qntcrtAt': -1})
			.exec((err, qunpds) => {
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
					ws.cell(1,9).string('Price Unit');
					ws.cell(1,10).string('Qunant');
					ws.cell(1,11).string('Total Price');

					for(let i=0; i<qunpds.length; i++){
						ws.cell((i+2), 1).string(String(i+1));

						let qunpd = qunpds[i];
						if(qunpd.brand) {
							ws.cell((i+2), 2).string(String(qunpd.brand.nome));
						} else if(qunpd.brandNome) {
							ws.cell((i+2), 2).string(String(qunpd.brandNome));
						}

						if(qunpd.area) ws.cell((i+2), 3).string(String(qunpd.area));

						if(qunpd.pdfir) {
							// ws.addImage({
							// 	path: qunpd.pdfir.photo,
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
							ws.cell((i+2), 4).string(String(qunpd.pdfir.code));
						} else if(qunpd.firNome) {
							ws.cell((i+2), 4).string(String(qunpd.firNome));
						}
						if(qunpd.pdsec) {
							ws.cell((i+2), 5).string("产品编号:" + String(qunpd.pdsec.code));
							ws.cell((i+2), 5).string("规格尺寸:" +String(qunpd.pdsec.spec));
						} else if(qunpd.firNome) {
							ws.cell((i+2), 5).string(String(qunpd.firNome));
							ws.cell((i+2), 5).string(String(qunpd.specf));
						}
						if(qunpd.pdthd) {
							let maters = '';
							for(let j=0; j<qunpd.pdthd.maters.length; j++){
								maters += qunpd.pdthd.maters[j] + ' ';
							}
							ws.cell((i+2), 6).string(maters);
							let crafts = '';
							for(let j=0; j<qunpd.pdthd.crafts.length; j++){
								crafts += qunpd.pdthd.crafts[j] + ' ';
							}
							ws.cell((i+2), 7).string(crafts);
						} else if(qunpd.thdNome) {
							ws.cell((i+2), 6).string(String(qunpd.mater));
							ws.cell((i+2), 7).string(String(qunpd.craft));
						}

						if(qunpd.note) ws.cell((i+2), 8).string(String(qunpd.note));

						if(qunpd.price && qunpd.quant) {
							let price = parseFloat(qunpd.price);
							let quant = parseInt(qunpd.quant);
							ws.cell((i+2), 9).string(String(price + ' €'));
							ws.cell((i+2), 10).string(String(quant));
							if(!isNaN(price) && !isNaN(quant)) {
								let tot = price * quant;
								ws.cell((i+2), 11).string(String(tot + ' €'));
							}
						}
					}

					wb.write('Inquiry_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
				}
			})
		}
	})
}