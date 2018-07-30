var fs = require("fs");
var nodemailer = require("nodemailer");
var ejs = require("ejs");
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.send = function({ resetURL, user, subject }) {
  ejs.renderFile(
    __dirname + "/../views/email-forgot.ejs",
    { resetURL },
    function(err, data) {
      if (err) {
        console.log(err);
      } else {
        var mainOptions = {
          from: "Noreply",
          to: user.email,
          subject,
          html: data
        };
        console.log("html data ======================>", mainOptions.html);
        transporter.sendMail(mainOptions, function(err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Message sent: " + info.response);
          }
        });
      }
    }
  );
};
