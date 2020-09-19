let fs = require('fs');
let path = require('path');
var cmpImg = require('compress-images');

let MiddleFile = {
	errPage : (res, info) => {
		res.render('./aaViews/index/wrongPage', {
			title: '500-15 Page',
			info
		});
	},

	deleteFile : (fileDel) => {
		if(fileDel) {
			fs.unlink(path.join(__dirname, '../../public' + fileDel), (err) => {
				if(err) {
					console.log(err);
					console.log('更新文件的时候, 可能会错误')
				}
			});
		}
	},

	fileNew : (req, res, next) => {
		let fl = req.body.fl;			// 获取文件主要名称
		let obj = req.body.obj;
		let fileData = req.files.fileUpload;	// 文件数据
		if(!fl.suffixs || !fl.nome || !fl.dir) {
			info = "不可修改前段代码!"
			MiddleFile.errPage(res, info);
		} else {
			if(fileData && fileData.originalFilename && fl.dir) {
				let filePath = fileData.path;		// 文件的位置
				if(obj && obj.fileOld){
					MiddleFile.deleteFile(obj.fileOld, fl.dir);
				}
				fs.readFile(filePath, (err, data) => {
					let suffixs = fl.suffixs.split(',')
					let suffix = fileData.type.split('/')[1];		// 文件类型
					if(suffixs.includes(suffix)) {
						let timestamp = Date.now();						// 时间戳
						let fileNome = fl.nome + '_' + timestamp + '.' + suffix;	// 文件名称 code_2340.jpg
						let fileSrc = path.join(__dirname, '../../public/upload'+fl.dir);	// niu/public/upload/***/
						let file = fileSrc + fileNome;
						fs.writeFile(file, data, (err) => {
							if(err) {
								console.log(err);
								info = "文件写入错误, 请重试"
								MiddleFile.errPage(res, info);
							} else {
								obj.file = '/upload'+fl.dir+fileNome;
								next();
							}
						});
					} else {
						info = "请选择: "+fl.suffixs+" 文件"
						MiddleFile.errPage(res, info);
					}
				});
			}
			else{
				next();
			}
		}
	},
};

module.exports = MiddleFile;