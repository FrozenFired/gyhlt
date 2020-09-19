let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Categ';
let dbSchema = new Schema({
	code: String,						// 默认名称
	en: String,							// 英文名称
	cn: String,							// 中文名称
	it: String,							// 意大利文

	shelf: {type: Number, default: 0},	// 上架 下架
	status: {type: Number, default: 0},	// 系列状态 
	weight: {type: Number, default: 0},	// 权重 排序用的

	ctAt: Date,
	upAt: Date,
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		if(!this.shelf) this.shelf = 0;
		if(!this.weight) this.weight = 0;
		if(!this.status) this.status = 0;
		this.upAt = this.ctAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);