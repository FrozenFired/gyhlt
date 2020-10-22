let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

// 付款对应的订单
const colection = 'Bill';
let dbSchema = new Schema({
	/* ============ 订单 ============ */
	firm: {type: ObjectId, ref: 'Firm'},		// 所属公司
	fner : {type: ObjectId, ref: 'User'},
	crtAt: Date,								// 创建时间

	genre: Number,								// 类型
	ordin: {type: ObjectId, ref: 'Ordin'},
	cter: {type: ObjectId, ref: 'User'},

	ordut: {type: ObjectId, ref: 'Ordut'},
	strmup: {type: ObjectId, ref: 'Strmup'},

	billPr: Float,		// 应收价格
	note: String,								// 备注

});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.crtAt) this.crtAt = Date.now();
	} else {

	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);