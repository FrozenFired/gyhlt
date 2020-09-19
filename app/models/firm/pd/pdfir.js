let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Pdfir';				// 系列
let dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},	// 所属公司
	brand: {type: ObjectId, ref: 'Brand'},	// 所属品牌

	code: String,							// 系列名称
	photo: String,							// 系列默认图片
	photos: [{type: String}],				// 系列其他图片

	pdnome: String,							// 所属品类
	categ: {type: ObjectId, ref: 'Categ'},

	desp: String,							// 系列描述
	website: String,

	shelf: {type: Number, default: 0},		// 上架 下架
	status: {type: Number, default: 0},		// 系列状态 
	weight: {type: Number, default: 0},		// 权重 排序用的

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