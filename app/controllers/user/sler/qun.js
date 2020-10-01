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

exports.slQun = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

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
			res.render('./user/sler/inquot/qun/detail', {
				title: '询价单详情',
				crUser,
				qun,
				qunpds: qun.compds,
			})
		}
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
		} else if(inquot.status != Conf.status.init.num && inquot.status != Conf.status.quoting.num){
			info = "这个询价单不可删除, 请联系管理员";
			Err.usError(req, res, info);
		} else if(inquot.status == Conf.status.quoting.num && inquot.compds.length != 0){
			info = "这个询价单不可删除, 请联系管理员";
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


exports.slInquotExcel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Inquot.findOne({_id: id, firm: crUser.firm})
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
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
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
			ws.cell(1,9).string('Qunant');
			ws.cell(1,10).string('报价价格(€)');
			ws.cell(1,11).string('Total Price(€)');
			ws.cell(1,12).string('销售价格(€)');
			ws.cell(1,13).string('Total Price(€)');

			let compds = qun.compds;

			let dinPrImp = qntPrImp = 0;
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
					if(compd.qntPr && !isNaN(parseFloat(compd.qntPr))) {
						let qntPr = parseFloat(compd.qntPr);
						ws.cell((i+2), 10).string(String(qntPr + ' €'));
						if(!isNaN(qntPr) && !isNaN(quant)) {
							let tot = qntPr * quant;
							qntPrImp += tot;
							ws.cell((i+2), 11).string(String(tot + ' €'));
						}
					}
					if(compd.dinPr && !isNaN(parseFloat(compd.dinPr))) {
						let dinPr = parseFloat(compd.dinPr);
						ws.cell((i+2), 12).string(String(dinPr + ' €'));
						if(!isNaN(dinPr) && !isNaN(quant)) {
							let tot = dinPr * quant;
							dinPrImp += tot;
							ws.cell((i+2), 13).string(String(tot + ' €'));
						}
					}
				}
			}
			i++;
			ws.cell((i+2), 11).string(String(qntPrImp+ ' €'))
			ws.cell((i+2), 13).string(String(dinPrImp+ ' €'))
			wb.write('Inquiry_'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
		}
	})
}