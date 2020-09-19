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
	qunAt: Date,								// 询价时间
	cterNome: String, 							// 客户名字

	quter: {type: ObjectId, ref: 'User'},		// 报价报价负责人
	qutAt: Date,								// 报价完成时间
	/* 上游公司报价 */

	/* ========== 基本信息 ========== */
	code: String,								// 编号
	qunNote: String,							// 备注
	qutNote: String,							// 备注
	strmup: {type: ObjectId, ref: 'Strmup'},	// 同步采购公司用的

	/* ========== 商品信息 ========== */
	compds: [{type: ObjectId, ref: 'Compd'}],
	/* ========== 付款信息 ========== */
	price: Float,

	status: {type: Number, default: 0},			// 系列状态 
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		if(!this.status) this.status = 10;
		this.ctAt = Date.now();
	} else {
		
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);