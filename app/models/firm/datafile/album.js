let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Album';
let dbSchema = new Schema({
	/* ===================== 不可更改 ===================== */
	firm: {type: ObjectId, ref: 'Firm'},
	brand: {type: ObjectId, ref: 'Brand'},
	year: Number,

	nome: String, 								// * 品牌名
	desp: String, 								// !描述

	photo: String,								// 封面
	pdf: String,								// 封面

	shelf: {type: Number, default: 0},	// 上架 下架
	weight: {type: Number, default: 0},	// 权重 排序用的

	ctAt: Date,
	upAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.shelf) this.shelf = 0;
		if(!this.weight) this.weight = 0;
		this.upAt = this.ctAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);