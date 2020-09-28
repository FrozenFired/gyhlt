let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;

const colection = 'Firm';
let dbSchema = new Schema({
	code: {			// 公司编号
		unique: true,
		type: String
	},
	categ: Number,			// 公司所属类型 公司类型 0 厂家 1 代理 2 经销 3 门店

	nome: String,	// 公司名
	logo: String, 	// 公司logo
	iva: String,	// 公司iva号
	cf: String,		// codice fisicale 税号
	resp: String,// 负责人
	tel: String,
	email: String,
	nation: String,	// Italy
	city: String,	// Torino
	addr: String,	// 地址 via orsiera
	post: String,	// 邮编 10141
	bank: String,
	iban: String,

	pdnomes: [{type: String}],
	categs: [{type: ObjectId, ref: 'Categ'}],

	posts: [{
		photo: String,
		title: String,
		desp: String,
		weight: Number
	}],

	ctAt: Date,
	upAt: Date,
});
dbSchema.pre('save', function(next) {
	if(this.isNew) {
		this.upAt = this.ctAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	next();
});

module.exports = mongoose.model(colection, dbSchema);