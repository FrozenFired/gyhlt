let fs = require('fs');
let path = require('path');
var cmpImg = require('compress-images');

let MiddlePicture = {
	deletePicture : (picDel, picDir) => {
		if(picDel && (picDel != '/upload' + picDir + '1.jpg')) {
			fs.unlink(path.join(__dirname, '../../public' + picDel), (err) => {
				if(err) {
					console.log(err);
					console.log('更新图片的时候, 可能会错误')
				}
			});
		}
	},

	pictureNew : (req, res, next) => {
		let crUserId = '';
		if(req.session.crUser) crUserId = req.session.crUser._id + '_';
		let obj = req.body.obj;
		let picName = req.body.picName;			// 获取图片主要名称
		let picDir = req.body.picDir;		// 图片要储存的位置
		let picData = req.files.picUpload;	// 图片数据
		if(picData && picData.originalFilename && picDir) {
			let filePath = picData.path;		// 图片的位置
			if(obj && obj.picOld){
				MiddlePicture.deletePicture(obj.picOld, picDir);
			}
			fs.readFile(filePath, (err, data) => {
				let type = picData.type.split('/')[1];		// 图片类型
				let timestamp = Date.now();						// 时间戳
				let picNome = picName + '_'+crUserId + timestamp + '.' + type;	// 图片名称 code_2340.jpg
				let picSrc = path.join(__dirname, '../../public/upload'+picDir);	// niu/public/upload/***/
				let picture = picSrc + picNome;
				fs.writeFile(picture, data, (err) => {
					if(err) console.log(err);
					obj.picture = '/upload'+picDir+picNome;
					next();
				});
			});
		}
		else{
			next();
		}
	},




	photoNew : (req, res, next) => {
		let crUserId = '';
		if(req.session.crUser) crUserId = req.session.crUser._id + '_';
		let obj = req.body.obj;
		let picName = req.body.picName;			// 获取图片主要名称
		let picDir = req.body.picDir;		// 图片要储存的位置
		let picData = req.files.photo;	// 图片数据
		if(picData && picData.originalFilename && picDir) {
			let filePath = picData.path;		// 图片的位置
			if(obj && obj.photoOld){
				MiddlePicture.deletePicture(obj.photoOld, picDir);
			}
			fs.readFile(filePath, (err, data) => {
				let type = picData.type.split('/')[1];		// 图片类型
				let timestamp = Date.now();						// 时间戳
				let picNome = picName + '_photo_'+crUserId + timestamp + '.' + type;	// 图片名称 code_2340.jpg
				let picSrc = path.join(__dirname, '../../public/upload'+picDir);	// niu/public/upload/***/
				let picture = picSrc + picNome;
				fs.writeFile(picture, data, (err) => {
					if(err) console.log(err);
					obj.photo = '/upload'+picDir+picNome;
					// console.log('photo: '+ obj.photo);
					next();
				});
			});
		}
		else{
			next();
		}
	},
	sketchNew : (req, res, next) => {
		let crUserId = '';
		if(req.session.crUser) crUserId = req.session.crUser._id + '_';
		let obj = req.body.obj;
		let picName = req.body.picName;			// 获取图片主要名称
		let picDir = req.body.picDir;		// 图片要储存的位置
		let picData = req.files.sketch;	// 图片数据
		if(picData && picData.originalFilename && picDir) {
			let filePath = picData.path;		// 图片的位置
			if(obj && obj.sketchOld){
				MiddlePicture.deletePicture(obj.sketchOld, picDir);
			}
			fs.readFile(filePath, (err, data) => {
				let type = picData.type.split('/')[1];		// 图片类型
				let timestamp = Date.now();						// 时间戳
				let picNome = picName + '_sketch_'+crUserId + timestamp + '.' + type;	// 图片名称 code_2340.jpg
				let picSrc = path.join(__dirname, '../../public/upload'+picDir);	// niu/public/upload/***/
				let picture = picSrc + picNome;
				fs.writeFile(picture, data, (err) => {
					if(err) console.log(err);
					obj.sketch = '/upload'+picDir+picNome;
					// console.log('sketch: '+obj.sketch);
					next();
				});
			});
		}
		else{
			next();
		}
	},
	imgsNew : (req, res, next) => {
		let imgsDatas = req.files.images;	// 图片数据
		MiddlePicture.imgsCallback(req, res, next, imgsDatas, 0);
	},

	imgsCallback : (req, res, next, imgsDatas, n) => {
		if(n == imgsDatas.length) {
			// console.log("------------------------\n\n");
			next()
		}else{
			let crUserId = '';
			if(req.session.crUser) crUserId = req.session.crUser._id + '_';
			let obj = req.body.obj;
			// console.log(obj.images)
			let picName = req.body.picName;			// 获取图片主要名称
			let picDir = req.body.picDir;		// 图片要储存的位置
			let picData = imgsDatas[n]
			if(picData && picData.originalFilename && picDir) {
				let filePath = picData.path;		// 图片的位置
				if(obj && obj.images && obj.images[n]){
					MiddlePicture.deletePicture(obj.images[n], picDir);
				}
				fs.readFile(filePath, (err, data) => {
					let type = picData.type.split('/')[1];		// 图片类型
					let timestamp = Date.now();						// 时间戳
					let picNome = picName + '_imgs['+n+']_'+crUserId + timestamp + '.' + type;	// 图片名称 code_2340.jpg
					let picSrc = path.join(__dirname, '../../public/upload'+picDir);	// niu/public/upload/***/
					let picture = picSrc + picNome;
					fs.writeFile(picture, data, (err) => {
						if(err) console.log(err);
						if(!obj.images) obj.images = new Array();
						obj.images[n] = '/upload'+picDir+picNome;
						// console.log('images['+n+']'+obj.images[n]);
						MiddlePicture.imgsCallback(req, res, next, imgsDatas, n+1);
					});
				});
			}
			else{
				MiddlePicture.imgsCallback(req, res, next, imgsDatas, n+1);
			}
		}
	}
};

module.exports = MiddlePicture;





	// addNewPhoto : (req, res, next) => {
	// 	let crUser = req.session.crUser;
	// 	// console.log(crUser.firm)
	// 	let obj = req.body.obj;
	// 	let picName = crUser.firm.code+'_'+obj.code;
	// 	let picDir = obj.picDir;
	// 	// console.log(picDir)
	// 	let picData = req.files.picUpload;
	// 	if(picData && picData.originalFilename) {
	// 		let filePath = picData.path;
	// 		if(obj.picOld){
	// 			MiddlePicture.deletePicture(obj.picOld, picDir);
	// 		}
	// 		fs.readFile(filePath, (err, data) => {
	// 			let type = picData.type.split('/')[1];
	// 			let timestamp = Date.now();
	// 			let picName = picName + '_' + timestamp + '.' + type;
	// 			let cacheSrc = path.join(__dirname, '../../public/upload/');
	// 			let picOldCache = cacheSrc + picName;
	// 			fs.writeFile(picOldCache, data, (err) => {
	// 				let picPath = path.join(__dirname, '../../public/upload'+picDir);
	// 				cmpImg(
	// 					cacheSrc+'*.{jpg,JPG,jpeg,JPEG,png,svg,gif}',
	// 					picPath,
	// 					{compress_force: false, statistic: true, autoupdate: true},
	// 					false,
	// 					{jpg: {engine: 'mozjpeg', command: ['-quality', '10']}},
	// 					{png: {engine: 'pngquant', command: ['--quality=20-50']}},
	// 					{svg: {engine: 'svgo', command: '--multipass'}},
	// 					{gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}},
	// 					(err, completed) => {
	// 						if(completed === true){
	// 						// Doing something.
	// 							fs.unlink(picOldCache, (err) => { });
	// 							obj.picture = '/upload'+picDir+picName;
	// 							next();
	// 						}
	// 					}
	// 				);
	// 			});
	// 		});
	// 	}
	// 	else{
	// 		next();
	// 	}
	// },