let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Ordut';
let dbSchema = new Schema({
	inquot: {type: ObjectId, ref: 'Inquot'},	// 所属询报价单
	/* ============ 采购订单 ============ */
	firm: {type: ObjectId, ref: 'Firm'},		// 所属公司
	duter : {type: ObjectId, ref: 'User'},		// 订单员
	strmup: {type: ObjectId, ref: 'Strmup'}, 	// 供应商

	crtAt: Date,								// 开单时间

	contractAt: Date,							// 签合同时间
	photo: String,							// 合同照片
	file: String,							// 合同文件

	/* ========== 基本信息 ========== */
	code: String,								// 采购订单编号

	note: String,								// 备注

	/* ========== 商品信息 ========== */
	compds: [{type:ObjectId, ref:'Compd'}],
	/* ========== 付款信息 ========== */
	dutImp: Float,			// 应收
	billPr: Float,		// 已收
	billAt: Date,		// 第一次付款时间
	bills: [{type: ObjectId, ref: 'Bill'}],

	dutDay: Number,						// 货期 xxx 天
	dutAt: Date,						// 提货日期

	status: Number,						// 系列状态 
	step: {type: Number, default: 0},		// 处理步骤 
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.status) this.status = 10;
		if(!this.step) this.step = 10;
		if(!this.dutImp) this.dutImp = 0;
		if(!this.billPr) this.billPr = 0;
		this.crtAt = Date.now();
	} else {

	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);