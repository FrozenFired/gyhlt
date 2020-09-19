let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Compd';
let dbSchema = new Schema({
	/* ==================================== 默认继承 询价单 ==================================== */
	firm: {type: ObjectId, ref: 'Firm'},		// 所属公司

	brand: {type: ObjectId, ref: 'Brand'},		// 品牌
	brandNome: String, 

	pdfir: {type: ObjectId, ref: 'Pdfir'},		// 系列
	firNome: String,								// 系列名
	photo: String,								// 照片

	pdsec: {type: ObjectId, ref: 'Pdsec'},		// 产品
	secNome: String,							// 产品编号(可填产品规格, 尺寸等)
	sketch: String,								// 草图

	pdthd: {type: ObjectId, ref: 'Pdthd'},		// 子产品
	thdNome: String,
	material: String,

	note: String,

	quant: Number,
	unit: Number, 	// 币种
	/* ============================= 询价单 ============================= */
	inquot: {type: ObjectId, ref: 'Inquot'},	// 所属询报价单
	quner : {type: ObjectId, ref: 'User'},		// 询价员
	qunAt: Date,								// 询价时间

	quter: {type: ObjectId, ref: 'User'},		// 报价报价负责人
	qutAt: Date,								// 报价完成时间
	price: Float,

	qntpdSts: {type: Number, default: 0},			// 商品状态 

	/* ============================= 销售订单 ============================= */
	ordin: {type: ObjectId, ref: 'Ordin'},		// 所属订单
	cter: {type: ObjectId, ref: 'User'}, 		// 客户
	cterNome: String,							// 销售价格
	dinPr: Float,								// 销售价格
	dinAt: Date,								// 交货日期
	dinpdSts: {type: Number, default: 0},			// 商品状态 

	/* ============================= 采购订单 ============================= */
	ordut: {type: ObjectId, ref: 'Ordut'},
	strmup: {type: ObjectId, ref: 'Strmup'}, 	// 供应商
	dutPr: Float,								// 采购价格
	dutAt: Date,						// 提货日期
	dutpdSts: {type: Number, default: 0},			// 商品状态 
	
	/* ============================= 物流运输 ============================= */
	transp: {type: ObjectId, ref: 'Transp'},
	trpAt:Date,
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.inAt = Date.now();
	} else {
		
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);