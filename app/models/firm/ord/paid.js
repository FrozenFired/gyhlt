let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

// 付款对应的订单
const colection = 'Paid';
let dbSchema = new Schema({
	/* ============ 销售订单 ============ */
	firm: {type: ObjectId, ref: 'Firm'},		// 所属公司
	fner : {type: ObjectId, ref: 'User'},
	fnAt: Date,									// 销售时间
	ctAt: Date,									// 创建时间

	ordut: {type: ObjectId, ref: 'Ordut'},

	note: String,								// 备注

	paidPr: Float,		// 应收价格

});

dbSchema.pre('save', function(next) {
	if(this.isNew) {

	} else {

	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);