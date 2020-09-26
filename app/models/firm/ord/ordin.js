let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Ordin';
let dbSchema = new Schema({
	inquot: {type: ObjectId, ref: 'Inquot'},	// 所属询报价单
	/* ============ 销售订单 ============ */
	firm: {type: ObjectId, ref: 'Firm'},		// 所属公司
	diner : {type: ObjectId, ref: 'User'},		// 销售员
	cter: {type: ObjectId, ref: 'User'}, 		// 客户
	cterNome: String,
	crtAt: Date,								// 开单时间

	contractAt: Date,							// 签合同时间
	photo: String,							// 合同照片
	file: String,							// 合同文件

	/* ========== 基本信息 ========== */
	code: String,								// 

	note: String,								// 备注

	/* ========== 商品信息 ========== */
	compds: [{type:ObjectId, ref:'Compd'}],
	/* ========== 付款信息 ========== */
	dinImp: Float,		// 销售订单货值
	recvPr: Float,		// 已收
	recvAt: Date,		// 第一次付款时间
	recvs: [{
		recvAt: Date,
		recv: {type: ObjectId, ref: 'Recv'}
	}],

	dinDay: Number,						// 货期 xxx 天
	dinAt: Date,						// 交货日期

	status: {type: Number, default: 0},		// 系列状态 
	step: {type: Number, default: 0},		// 处理步骤 
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		if(!this.status) this.status = 10;
		if(!this.step) this.step = 10;
		this.crtAt = Date.now();
	} else {

	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);