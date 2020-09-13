var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');
const url = 'http://localhost:3000/api/user/emailVerify'
const from = '"Lighhouse Arabia" <adm.lighthousearabia@gmail.com>'
var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      throw err;
      callback(err);
    }
    else {
      callback(null, html);
    }
  });
};

smtpTransport = nodemailer.createTransport(smtpTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  /* secure: true,
  port: 465, */
  auth: {
    user: 'adm.lighthousearabia@gmail.com',
    pass: 'ad324SDXCwefdowkcs76'
  }
}));
class sendMail {
  signUp = (mail, token) => {
    /* signUp = async () => { */
      console.log('deltails====>', mail, token, url);
      
    readHTMLFile(__dirname + '/verify.html', function (err, html) {
      var template = handlebars.compile(html);
      var replacements = {
        url: `${url}?token=${token}`,
        email: mail
      };
      var htmlToSend = template(replacements);
      var mailOptions = {
        from,
        to: mail,
        subject: "Please Verify Your E-mail for WeboneAc",
        html: htmlToSend
      };
      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
          return error
        }
        console.log('mail send', response);

      });
    });
  }
  appointmentConfirmation = (data) => {
      console.log('deltails====>', data);
    const url = 'http://35.239.10.74:3005/email';
    readHTMLFile(__dirname + '/email/html/confirmation_appointment.html', function (err, html) {
      var template = handlebars.compile(html);
      var replacements = {
        clinician: data.clinician,
        date: data.date,
        time: data.time,
        fee: data.fee,
        vill: data.address,
        url,
        client: data.client
      };
      var htmlToSend = template(replacements);
      var mailOptions = {
        from,
        to: data.email,
        subject: "Appointment Confirmation!",
        html: htmlToSend
      };
      smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log(error);
          return error
        }
        console.log('mail send', response);
      });
    });
  }

  sendInvoice = async (data) => {
    let info = await smtpTransport.sendMail({
      from,
      replyto: 'info@webonex.in',
      to: data.email, 
      subject: data.subject,
      html: `${data.massage} <a href="http://localhost:3000/document/${data.invoiceId}">Click to view invoice</a>`
    });
  
    console.log("Message sent: %s", info.messageId);
    return info
  }

  user = async (data) => {
    let info = await smtpTransport.sendMail({
      from,
      to: data.email, 
      subject: data.subject,
      html: data.body
    });
  
    console.log("Message sent: %s", info.messageId);
    return info
  }
  
  client = async (data) => {
    let info = await smtpTransport.sendMail({
      from,
      to: data.email, 
      subject: data.subject,
      html: data.body
    });
  
    console.log("Message sent: %s", info.messageId);
    return info
  }

}
const SendMail = new sendMail();
module.exports = SendMail;
