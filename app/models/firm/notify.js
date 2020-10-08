let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;

const colection = 'Notify';
let dbSchema = new Schema({
	level: Number,
	read: Number,	// 判断是否已经阅读

	compd : { type: ObjectId, ref: 'Compd' },
	inquot : { type: ObjectId, ref: 'Inquot'},
	ordin : { type: ObjectId, ref: 'Ordin' },

	mark: Number,
	from: { type: ObjectId, ref: 'User' },
	to: { type: ObjectId, ref: 'User' },
	replys: [{ type: ObjectId, ref: 'Notify'}],		// 一级留言包含的所有二级留言
	belong: { type: ObjectId, ref: 'Notify'},		// 所属一级留言
	reply: { type: ObjectId, ref: 'Notify'},		// 对二级留言的回复
	content: String,
	photo: String,

	crtAt: Date,
	updAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.read) this.read = -1;
		if(!this.level) this.level = 1;
		this.updAt = this.crtAt = Date.now();
	} else {
		this.updAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);