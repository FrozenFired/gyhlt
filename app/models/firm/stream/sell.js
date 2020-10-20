let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Sell';
let dbSchema = new Schema({
	/* ===================== 不可更改 ===================== */
	firm: {type: ObjectId, ref: 'Firm'},

	strmdw: {type: ObjectId, ref: 'Strmdw'},
	brand: {type: ObjectId, ref: 'Brand'},

	discount: String,							// 折扣
	note: String,							// 备注

	shelf: {type: Number, default: 0},	// 上架 下架
	weight: {type: Number, default: 0},	// 权重 排序用的
	status: Number,						// 供应商状态 

	crter: {type: ObjectId, ref: 'User'},
	upder: {type: ObjectId, ref: 'User'},
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