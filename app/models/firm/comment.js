let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Comment';
let dbSchema = new Schema({

	inquot : { type: ObjectId, ref: 'Inquot' },
	ordin : { type: ObjectId, ref: 'Ordin' },

	mark: Number,
	from: { type: ObjectId, ref: 'User' },
	replys: [{
		mark: Number,
		from: { type: ObjectId, ref: 'User' },
		to: { type: ObjectId, ref: 'User' },
		content: String,
		ctAt: {
			type: Date,
			default: Date.now()
		}
	}],
	content: String,

	status: Number,					// 重点 
	weight: {type: Number, default: 0},	// 权重 置顶 排序用的

	ctAt: Date,
	upAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.weight) this.weight = 0;
		if(!this.status) this.status = 0;
		this.upAt = this.ctAt = Date.now();
	} else {
		this.upAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);