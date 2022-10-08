import nodemailer from 'nodemailer'

const USER_MAILTRAP = process.env.USER_MAILTRAP
const PASSWORD_MAILTRAP = process.env.PASSWORD_MAILTRAP

export const transporter = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: '', //TODO: CAMBIAR A VARIABLE DE ENTORNO
		pass: '', //TODO: CAMBIAR A VARIABLE DE ENTORNO
	},
})

transporter.verify().then(() => {
	console.log('Ready to send emails')
})
