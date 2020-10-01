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


exports.slDinExcel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Ordin.findOne({_id: id})
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
			ws.cell(1,10).string('销售价格(€)');
			ws.cell(1,11).string('Total Price(€)');

			let compds = din.compds;

			let dinPrImp = 0;
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

					if(compd.dinPr && !isNaN(parseFloat(compd.dinPr))) {
						let dinPr = parseFloat(compd.dinPr);
						ws.cell((i+2), 10).string(String(dinPr + ' €'));
						if(!isNaN(dinPr) && !isNaN(quant)) {
							let tot = dinPr * quant;
							dinPrImp += tot;
							ws.cell((i+2), 11).string(String(tot + ' €'));
						}
					}
				}
			}
			i++;
			ws.cell((i+2), 11).string(String(dinPrImp+ ' €'))
			wb.write('Order_in'+ moment(new Date()).format('YYYYMMDD-HHmmss') + '.xlsx', res);
		}
	})
}