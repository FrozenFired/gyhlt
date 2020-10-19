let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Inquot';
let dbSchema = new Schema({
	/* ============= 采购公司来看 =============== */
	/* 本公司报价 */
	firm: {type: ObjectId, ref: 'Firm'},		// 所属公司
	quner : {type: ObjectId, ref: 'User'},		// 询价员
	cter: {type: ObjectId, ref: 'User'}, 		// 客户
	cterNome: String, 							// 客户姓名
	percent: Number,							// 客户加点

	crtAt: Date,								// 询价创建时间
	updAt: Date,								// 询价更新时间
	fnlAt: Date,								// 报价完成时间

	quter: {type: ObjectId, ref: 'User'},		// 报价报价负责人

	/* ========== 基本信息 ========== */
	code: String,								// 编号
	times: Number,								// 报价次数


	/* ========== 商品信息 ========== */
	compds: [{type: ObjectId, ref: 'Compd'}],
	ordin: {type: ObjectId, ref: 'Ordin'},		// 生成的订单

	status: Number,							// 系列状态
	quterSt: Number,						// 报价员状态
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.status) this.status = 10;
		if(!this.quterSt) this.quterSt = 10;
		if(!this.times) this.times = 1;
		if(!this.qntPr) this.qntPr = 0;
		if(!this.crtAt) this.crtAt = Date.now();
		if(!this.updAt) this.updAt = Date.now();
	} else {

	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);