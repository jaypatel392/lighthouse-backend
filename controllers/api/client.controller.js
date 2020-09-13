const { of } = require('await-of');
const BaseController = require('./base.controller');
const Client = require('../../models/client.model');
const Responder = require('../../lib/expressResponder');
const admin = require('firebase-admin');
const Child = require('../../models/child.model');
const { base } = require('../../models/client.model');
require('../../lib/authorizeUser');
require('../../lib/authorizeClient');
const SendMail = require('../../lib/sendMail');
const dayjs = require('dayjs');

class ClientController extends BaseController {
  constructor() {
    super();
    console.log('Initializing user contoller');
  }

  signUp = async (req, res) => {
    admin.auth().verifyIdToken(req.headers.authorization)
      .then(async (response) => {
        const client = await Client.findOne({ email: response.email });
        if (client) {
          if (client.uid == null) {
            const [updateUid, errUpdate] = await of(Client.findByIdAndUpdate(client._id, { uid: response.uid }));
            if (errUpdate) Responder.operationFailed(res, updateErr);
            Responder.success(res, updateUid);
          } else {
            Responder.success(res, client)
          }
        } else {
          const [result, err] = await of(new Client({
            uid: response.user_id,
            firstName: response.name,
            email: response.email,
            avatar: response.picture,
            status: 'active',
            otp: '',
            otpSentTime: new Date(),
            verify: true
          }).save());
          if (err) {
            Responder.operationFailed(res, err)
          }
          console.log('result : ============ ', result);
          Responder.success(res, result);
        }
      }).catch((error) => {
        console.log('errrrrrrrrrrrr', error);
        Responder.operationFailed(res, error)
      });
  }

  signUp_manual = async (req, res) => {
    admin.auth().verifyIdToken(req.headers.authorization)
      .then(async (response) => {
        const client = await Client.findOne({ uid: response.uid });
        if (client) {
          Responder.success(res, client);
        }else {
          let otp = Math.floor(100000 + Math.random() * 900000);
          const [result, err] = await of(new Client({
            uid: response.user_id,
            firstName: req.body.firstName,
            email: response.email,
            avatar: response.picture,
            dob: req.body.dob,
            status: 'active',
            otp: otp,
            otpSentTime: new Date,
            verify: false
          }).save());
          
          const payload = {
            email: response.email,
            subject: `Wel-come To The Light House Please Verify Self. ${req.body.firstName}`,
            body: `<p>Your one time password for email verification is <bold></p> ${otp}`
          }
          await SendMail.user(payload);
          
          if (err) {
            Responder.operationFailed(res, err)
          }
          Responder.success(res, result);
        }
      }).catch((error) => {
        console.log('errrrrrrrrrrrr', error);
        Responder.operationFailed(res, error)
      });
  }

  addAdult = async (req, res) => {
    const { object } = req.body
    const clientId = await object.map(async adult => {
      const client = await Client.findOne({ email: adult.email });
      if (client) {
        const update = await Client.findByIdAndUpdate(client._id, { $addToSet: { relationshipAccount: req.client._id } });
        return client._id
      } else {
        const client = new Client({
          ...adult,
          status: 'active',
          relationshipAccount: req.client._id
        });
        const [result, err] = await of(client.save());
        if (err) Responder.operationFailed(res, err)
        return result._id
      }
    })
    const promiss = await Promise.all(clientId);
    console.log('clientIds===>', promiss);
    const [clientUpdate, updateErr] = await of(Client.findByIdAndUpdate(req.client._id, { $addToSet: { relationshipAccount: promiss } }));
    if (updateErr) Responder.operationFailed(res, updateErr);
    Responder.success(res, clientUpdate);
  }

  update = async (req, res) => {
    try{
      let data = {
        ...req.body
      }
      if (req.file) {
        data.idCopy = req.file.filename;
      }
      console.log('req.client ====================== ', req.client);
      /* console.log(req.client._id); */
      if (req.client) {
        const [result, err] = await of(Client.findByIdAndUpdate(req.client._id, data));
        if (err) {
          Responder.operationFailed(res, err)
        }
        const [update, updateErr] = await of(Client.findByIdAndUpdate(req.client._id, { $addToSet: { relationshipAccount: [result._id] } }));
        if (updateErr) console.log(updateErr);
        Responder.success(res, result);
      }
    }catch(e){
      console.log('Error in update cllient: ', e);
    }

  }

  getAdult = async (req, res) => {
    const [result, err] = await of(Client.find({
      'relationshipAccount': { $in: req.client._id }
    }));
    if (err) Responder.operationFailed(res, err);
    Responder.success(res, result)
  }

  info = async (req, res) => {
    try{

      const [result, err] = await of(Client.findById(req.client._id, {otp:0, password:0, otpSentTime:0}));
      if (err) {
        return Responder.operationFailed(res, err);
      }
      Responder.success(res, result);
    }catch(e){
      console.log('Error in info: ', e);
      return Responder.operationFailed(res, e);
    }
  }

  deleteuser = async (req, res) => {
    admin.auth().deleteUser(req.client.uid)
      .then(async function () {
        console.log('Successfully deleted user');
        const [result, err] = await of(Client.findByIdAndDelete(req.client._id));
        if (err) {
          Responder.operationFailed(res, err)
        } else {
          Responder.success(res, result)
        }
      })
      .catch(function (error) {
        console.log('Error deleting user:', error);
      });
  }

  allRelation = async (req, res) => {
    const client = req.client;
    const [child, err] = await of(Child.find({ clientId: client._id }));
    if (err) Responder.operationFailed(res, err);
    const [relations, relationErr] = await of(Client.find({ relationshipAccount: { $in: [client._id] } }));
    if (relationErr) Responder.operationFailed(res, relationErr);
    const data = [];
    // await data.push({
    //   ...client._doc,
    //   type: 'self'
    // })
    await child.map(child => {
      data.push({
        ...child._doc,
        type: 'child'
      })
    })
    await relations.map(client => {
      data.push({
        ...client._doc,
        type: 'adult'
      })
    })
    Responder.success(res, data)
  }

  getUserByUid = async (req, res) => {
    try{
      const [result, err] = await of(Client.findOne({uid: req.params.uid}, {otp:0, password:0, otpSentTime:0}));
      if (err) {
        Responder.operationFailed(res, err);
      }
      Responder.success(res, result);
    }catch(e){
      console.log("Error in getUserByUid: ", e);
    }
  }

  verifyOTP = async (req, res) => {
    const data = { ...req.body };
		const query = {email: data.email};
		const [ result, err ] = await of(Client.findOne(query));
		if (err) {
			Responder.operationFailed(res, err)
		}
		let now = new Date()
		let expiry = dayjs(result.otpSentTime).add(10, "minute").$d;
		if (parseInt(result.otp) === parseInt(data.otp)){
			if(now < expiry){
				const [ updatedUser, updateError ] = await of(Client.findByIdAndUpdate(result._id, {new:true}));
				if (updateError) {
					Responder.operationFailed(res, updateError)
        }
        delete updatedUser.password;
				Responder.success(res, updatedUser)
			}
			else Responder.operationFailed(res, "OTP has expired! Please Resend.")
		}
		else Responder.operationFailed(res, "Invalid OTP! Please enter valid OTP.")
  }
  
	resendOTP = async (req, res) => {
		const data = { ...req.body };
		const otp = Math.floor(100000 + Math.random() * 900000);
		const otpSentTime = new Date;

		const [ updatedUser, updateError ] = await of(Client.findOneAndUpdate({email: data.email}, { otp: otp, otpSentTime: otpSentTime}, {new:true}));
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

  getUserInfo = async (req, res) => {
    try{
      const [result, err] = await of(Client.findOne({_id: req.params.id}, {otp:0, password:0, otpSentTime:0}));
      if (err) {
        Responder.operationFailed(res, err);
      }
      Responder.success(res, result);
    }catch(e){
      console.log("Error in getUserByUid: ", e);
    }
  }
}

module.exports = {
  signUp: BaseController.get(ClientController, 'signUp'),
  update: BaseController.get(ClientController, 'update'),
  signUp_manual: BaseController.get(ClientController, 'signUp_manual'),
  info: BaseController.get(ClientController, 'info'),
  deleteuser: BaseController.get(ClientController, 'deleteuser'),
  addAdult: BaseController.get(ClientController, 'addAdult'),
  getAdult: BaseController.get(ClientController, 'getAdult'),
  allRelation: BaseController.get(ClientController, 'allRelation'),
  getUserByUid: BaseController.get(ClientController, 'getUserByUid'),
  verifyOTP: BaseController.get(ClientController, 'verifyOTP'),
  resendOTP: BaseController.get(ClientController, 'resendOTP'),
  getUserInfo: BaseController.get(ClientController, 'getUserInfo'),
};
