let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Pdsec';			// 产品编号
let dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},
	brand: {type: ObjectId, ref: 'Brand'},
	pdfir: {type: ObjectId, ref: 'Pdfir'},	// 所属系列

	photo: String,		// 照片

	code: String,		// 产品编号
	nome: String,
	spec: String, 		// 产品规格 尺寸

	desp: String, 		// 描述

	shelf: {type: Number, default: 0},	// 上架 下架
	status: Number,						// 品牌状态 
	weight: {type: Number, default: 0},	// 权重 排序用的

	ctAt: Date,
	upAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.shelf) this.shelf = 1;
		if(!this.weight) this.weight = 0;
		if(!this.status) this.status = 0;
		this.upAt = this.ctAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);