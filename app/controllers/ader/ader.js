const Err = require('../aaIndex/err');
const ObjDB = require('../../models/login/ader')
const _ = require('underscore')


exports.aderAdd = (req, res) => {
	res.render('./ader/ader/add', {
		title: 'Add Adminnistrator',
		crAder : req.session.crAder,
		action: "/aderNew",
	})
}

exports.aderNew = (req, res) => {
	let obj = req.body.obj
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '');
	ObjDB.findOne({code: obj.code}, (err, objSame) => {
		if(err) {
			info = "添加admin时数据库错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else if(objSame) {
			info = "此帐号已经被注册，请重新注册"
			Err.usError(req, res, info)
		} else {
			let _ader = new ObjDB(obj)
			_ader.save((err, objSave) => {
				if(err) {
					info = "添加admin时数据库存储admin错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect('/aders')
				}
			})
		}
	})
}

exports.aders = (req, res) => {
	ObjDB.find((err, objects) => {
		if(err) {
			info = "查看adimn列表时 数据库查找错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			res.render('./ader/ader/list', {
				title: '用户列表',
				crAder : req.session.crAder,
				objects: objects
			})
		}
	})
}

exports.ader = (req, res) => {
	let id = req.params.id
	ObjDB.findOne({_id: id}, (err, object) => {
		if(err) {
			info = "查看adimn信息时 数据库查找错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else if(!object) {
			info = "This code is not exist";
			Err.usError(req, res, info)
		} else {
			res.render('./ader/ader/detail', {
				title: '用户列表',
				crAder : req.session.crAder,
				object: object
			})
		}
	})
}

exports.aderDelAjax = (req, res) => {
	let id = req.query.id
	ObjDB.findOne({_id: id}, (err, object) => {
		if(err) {
			res.json({success: 0, info: "删除adimn时 数据库查找错误, 请截图后, 联系管理员"})
		} else if(object){
			ObjDB.deleteOne({_id: id}, (err, object) => {
				if(err) console.log(err) 
				res.json({success: 1})
			})
		} else {
			res.json({success: 0, info: "已被删除，按F5刷新页面查看"})
		}
	})
}