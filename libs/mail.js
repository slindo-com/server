const sendgridHelper = require('sendgrid').mail,
  sendgrid = require('sendgrid')(process.env.SENDGRID_KEY)


exports.sendMail = ({ from, to, subject, body }) =>
  new Promise((resolve, reject) => {
    const fromEmail = new sendgridHelper.Email(from),
      toEmail = new sendgridHelper.Email(to),
      content = new sendgridHelper.Content('text/plain', body),
      mail = new sendgridHelper.Mail(fromEmail, subject, toEmail, content),

    request = sendgrid.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    })

    sendgrid.API(request, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })