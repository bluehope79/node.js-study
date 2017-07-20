var express =require('express');
var app = express();

var uploadController = require('../controllers/uploadController');
var logoutController = require('../controllers/logoutController');
var mainController = require('../controllers/mainController');
var welcomeController = require('../controllers/welcomeController');
var registerController = require('../controllers/registerController');
var loginController = require('../controllers/loginController');
var chatingController = require('../controllers/chatingController');

//모듈화
module.exports = function (app) {

//chating
app.route('/chating').get(chatingController.chating);
//file upload
app.route('/upload').get(uploadController.uploadGet);
app.route('/upload').post(uploadController.upload.single('userfile'), uploadController.uploadPost);
//welcome
app.route('/').get(welcomeController.welcome);
//logout
app.route('/auth/logout').get(logoutController.logout);
//main page
app.route('/main').get(mainController.main);
//registe
app.route('/register').get(registerController.registerGet);
app.route('/register').post(registerController.registerPost);
//login page
app.route('/login').get(loginController.loginGet);
app.route('/login').post(loginController.loginPost);



};
