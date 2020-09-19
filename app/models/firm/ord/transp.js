let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Transp';
let dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},		// 所属公司
	lger : {type: ObjectId, ref: 'User'},		// 物流人员
	trpAt: Date,
	trpDay: Number,						// 货运 xxx 天
	arrivAt: Date,						// 到岗日期

	/* ========== 基本信息 ========== */
	code: String,								// 
	note: String,								// 备注

	/* ========== 商品信息 ========== */
	compds: [{type:ObjectId, ref:'Compd'}],


	status: {type: Number, default: 0},		// 系列状态 
	step: {type: Number, default: 0},		// 处理步骤 
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		if(!this.status) this.status = 10;
		if(!this.step) this.step = 10;
		this.ctAt = Date.now();
	} else {

	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);