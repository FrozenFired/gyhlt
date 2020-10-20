let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Brand';
let dbSchema = new Schema({
	/* ===================== 不可更改 ===================== */
	firm: {type: ObjectId, ref: 'Firm'},

	code: String,								// * #品牌编号
	nome: String, 								// * 品牌名
	logo: String, 								// * logo

	post: String,								// 公司海报
	firmName: String, 								// 所属公司名称
	country: String,							// 所属国家名称
	// nation: {type: ObjectId, ref: 'Nation'},	// 所属国家
	/* ===================== 不可更改 ==================== */

	website: String,	// 网址备注
	webNote: String,	// 网址备注
	desp: String, 								// !描述
	pTime: String, 								// !生产周期

	pdnomes: [{type: String}], 					// 品牌下的品类
	// categs: [{type: ObjectId, ref: 'Categ'}],
	pdfirs: [{type: ObjectId, ref: 'Pdfir'}],	// 品牌下的系列

	buys: [{type: ObjectId, ref: 'Buy'}],
	buynum: Number,		// 品牌折扣排序用的
	discount: Number,	// 品牌默认折扣

	shelf: {type: Number, default: 0},	// 上架 下架
	status: Number,								// 品牌状态 
	weight: {type: Number, default: 0},	// 权重 排序用的

	crtAt: Date,
	updAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.shelf) this.shelf = 0;
		if(!this.weight) this.weight = 0;
		if(!this.status) this.status = 0;
		this.updAt = this.crtAt = Date.now();
	} else {
		this.updAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);