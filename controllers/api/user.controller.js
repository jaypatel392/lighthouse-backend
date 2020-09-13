const { of } = require('await-of');
const BaseController = require('./base.controller')
const User = require('../../models/user.model');
const Session = require('../../models/session.model');
const Responder = require('../../lib/expressResponder');
const Role = require('../../models/role.model');
const firebase = require('../../lib/firebaseAuth');
const admin = require('firebase-admin');
const { random } = require('lodash');
const SendMail = require('../../lib/sendMail');
const dayjs = require('dayjs');
const { query } = require('winston');

require('../../lib/authorizeUser');

class UserController extends BaseController {
	constructor() {
		super();

		console.log('Initializing user contoller');
	}
	login = async (req, res) => {
		console.log('body', req.body);
		try {
			const { userName, password } = req.body;
			const [user, error] = await of(User.findOne({ userName })/* .populate({ path: 'role', model: 'Role', select: 'role' }) */);

			if (error) {
				Responder.operationFailed(res, error)
			}

			if (!user) {
				Responder.success(res, 'username and password invalid');
			}

			if (user.verify === 'false') {
				console.log('not verify');
				return res.status(401).send({ message: 'User not veryfy email, Please verify First' });
			}

			if (!user.validatePassword(password)) {
				Responder.success(res, 'invalid password')
			} else {
				const { token } = await user.getNewSession();
				Responder.success(res, { data: { token, user } })
			}
		}
		catch (err) {
			Responder.operationFailed(res, err)

		}
	}

	signUp = async (req, res) => {
		try {
			const data = { ...req.body };
			data.otp = Math.floor(100000 + Math.random() * 900000)
			data.otpSentTime = new Date
			data.verify="false"

			const [ result, err ] = await of(new User(data).save());
			if (err) {
				Responder.operationFailed(res, err);
			}
			const payload = {
				email: data.email,
				subject: `Wel-come To The Light House Please Verify Self. ${data.firstName +' '+ data.lastName}`,
				body: `<p>Your one time password for email verification is <bold></p> ${data.otp}`
			}
			const sendMail = await SendMail.user(payload);
			console.log('user send mail============>', sendMail);
			  
			Responder.success(res, result)
		} catch (err) {
			console.log(err);
		}
	}

	checkUserName = async (req, res) => {
		const { user } = req.query
		const [username, err] = await of(User.findOne({ userName: user }));

		if (err) {
			Responder.operationFailed(res, err);
		}
		if (!username) {
			Responder.success(res, 'true');
		} else {
			Responder.success(res, 'false')
		}
	}

	clinicians = async (req, res) => {
		const roleId = await Role.findOne({
			role: {
				$regex: new RegExp(`.*${'clinician'}.*`.toLowerCase(), "i")
			},
		})
		console.log(roleId);
		
		const [result, err] = await of(User.find({
			role: roleId
	  	}));
		if (err) {
			Responder.operationFailed(res, err)
		}
		Responder.success(res, result)
	}

	getById = async (req, res) => {
		const [ result, err ] = await of(User.findById(req.params.userId));
		if (err) {
			Responder.operationFailed(res, err)
		}
		Responder.success(res, result)
	}

	verifyOTP = async (req, res) => {
		const data = { ...req.body };
		const query = {email: data.email}
		const [ result, err ] = await of(User.findOne(query));
		if (err) {
			Responder.operationFailed(res, err)
		}

		let now = new Date()
		let expiry = dayjs(result.otpSentTime).add(10, "minute").$d
		
		if (result.otp===data.otp){
			if(now<expiry){
				const [ updatedUser, updateError ] = await of(User.findByIdAndUpdate(result._id, {verify:"true", otp: null}, {new:true}));
				if (updateError) {
					Responder.operationFailed(res, updateError)
				}
				Responder.success(res, updatedUser)
			}
			else Responder.operationFailed(res, "OTP has expired")
		}
		else Responder.operationFailed(res, "Wrong OTP")
	}

	resendOTP = async (req, res) => {
		const data = { ...req.body };
		const otp = Math.floor(100000 + Math.random() * 900000);
		const otpSentTime = new Date;

		const [ updatedUser, updateError ] = await of(User.findOneAndUpdate({email: data.email}, { otp: otp, otpSentTime: otpSentTime}, {new:true}));
		if (updateError) {
			Responder.operationFailed(res, err)
		}

		const payload = {
			email: data.email,
			subject: `Wel-come To The Light House Please Verify Self.`,
			body: `<p>Your one time password for email verification is <bold></p> ${otp}`
		}
		const sendMail = await SendMail.user(payload);
		console.log('user send mail============>', sendMail);

		Responder.success(res, updatedUser)
	}

}

module.exports = {
	login: BaseController.get(UserController, 'login'),
	signUp: BaseController.get(UserController, 'signUp'),
	checkUserName: BaseController.get(UserController, 'checkUserName'),
	clinicians: BaseController.get(UserController, 'clinicians'),
	getById: BaseController.get(UserController, 'getById'),
	verifyOTP: BaseController.get(UserController, 'verifyOTP'),
	resendOTP: BaseController.get(UserController, 'resendOTP')
};
