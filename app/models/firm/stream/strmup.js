let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ObjectId = Schema.Types.ObjectId;
let Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Strmup';
let dbSchema = new Schema({
	/* ===================== 不可更改 ===================== */
	firm: {type: ObjectId, ref: 'Firm'},		// 此供应商的所属公司

	firmUp: {type: ObjectId, ref: 'Firm'},		// 此公司对应的上游公司供应商
	accept: Number,
	// 由firmUp控制, 如果firmup接受 则accept变为1, 
	// 而且firmUp会自动创建自己的客户strmdw, 其中的accept为1
	// 如果firm删除此供应商 则供应商中的strmdw 中的accept变为0

	nome: String, 								// 供应商名
	categFirm: Number,							// 供应商类型
	note: String, 								// 备注

	country: String,							// 所属国家名称
	addr: String, 
	resp: String,// 负责人
	tel: String,
	email: String,

	ac: String,								// 首款比例
	sa: String,								// 尾款比例
	payNote: String,						// 首位款比例备注

	shelf: {type: Number, default: 0},	// 上架 下架
	weight: {type: Number, default: 0},	// 权重 排序用的
	status: {type: Number, default: 0},	// 供应商状态 

	ctAt: Date,
	upAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.accept) this.accept = 0;
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