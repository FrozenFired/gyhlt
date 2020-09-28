let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;

const colection = 'Article';
let dbSchema = new Schema({
	/* ===================== 不可更改 ===================== */
	firm: {type: ObjectId, ref: 'Firm'},
	categ: Number,		// 新闻 项目案例

	title: String,
	desp: String,
	content: String,
	photo: String,
	photos: [{type: String}],

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