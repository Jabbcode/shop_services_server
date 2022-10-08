import { Request, Response } from 'express'
import { generarJWT } from '../helpers/jws'
import { transporter } from '../config/mailer'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { htmlEmailForgotPassword, htmlEmailVerify } from '../utils/msgEmails'

const SECRET_JWT = process.env.SECRET_JWT

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body

	try {
		const userDB = await User.findOne({ email })

		if (!userDB) {
			return res.status(400).json({
				msg: 'User or password invalid',
			})
		}

		const validPassword = bcrypt.compareSync(password, String(userDB.password))

		if (!validPassword) {
			return res.status(400).json({
				msg: 'User or password invalid',
			})
		}

		if (userDB.email_validated === false) {
			return res.status(403).json({
				msg: 'You must verify the email to be able to access the system',
			})
		}

		const token = await generarJWT(userDB.id, String(userDB.email))

		res.status(202).json({
			user: {
				firstname: userDB.firstname,
				lastname: userDB.lastname,
				phone: userDB.phone,
				address: userDB.address,
				email: userDB.email,
				email_validated: userDB.email_validated,
			},
			token,
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Something bad happened...',
		})
	}
}

export const register = async (req: Request, res: Response) => {
	const { email, password } = req.body

	try {
		const userDB = await User.findOne({ email })

		if (userDB) {
			return res.status(400).json({
				msg: 'Email is already in use',
			})
		}

		let newUser = new User(req.body)

		const salt = bcrypt.genSaltSync()
		newUser.password = bcrypt.hashSync(password, salt)
		newUser.email_validated = false

		await newUser.save()

		const token = await generarJWT(newUser.id, String(newUser.email))

		//TODO: aqui se coloca es el HOST del FRONT y el toma el TOKEN y lo envia por headers al endpoint verify email
		let verificationLink = `http://localhost:3000/api/v1/auth/verify-email/${token}`

		await transporter.sendMail(htmlEmailVerify(String(newUser.email), verificationLink))

		return res.status(200).json({
			msg: 'The email was sent correctly',
			user: {
				firstname: newUser.firstname,
				lastname: newUser.lastname,
				phone: newUser.phone,
				address: newUser.address,
				email: newUser.email,
				email_validated: newUser.email_validated,
			},
			token,
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Something bad happened...',
		})
	}
}

export const verifyEmail = async (req: Request, res: Response) => {
	//TODO: Hacer pruebas para tomar el token del header y no de la URL
	const token = req.headers['x-access-token']

	if (!token) {
		return res.status(403).json({ msg: 'A token was not sent' })
	}

	try {
		const { email } = jwt.verify(String(token), String(SECRET_JWT)) as {
			email: string
		}
		let userDB = await User.findOne({ email })

		if (!userDB) {
			return res.status(500).json({ msg: 'Something bad happened...' })
		}

		userDB.email_validated = true

		await userDB.save()

		return res.status(201).json({
			msg: 'Your email was verified correctly',
			user: {
				firstname: userDB.firstname,
				lastname: userDB.lastname,
				phone: userDB.phone,
				address: userDB.address,
				email: userDB.email,
				email_validated: userDB.email_validated,
			},
			token,
		})
	} catch (error) {
		console.log(error)
		return res.status(401).json({
			msg: 'Token invalid',
		})
	}
}

export const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body

	try {
		const userDB = await User.findOne({ email })

		if (!userDB) {
			return res.status(400).json({ msg: 'Email invalid' })
		}

		const token = await generarJWT(userDB.id, String(userDB.email))

		//TODO: aqui se coloca es el HOST del FRONT y el toma el TOKEN y lo envia por headers al endpoint new-password
		let verificationLink = `http://localhost:3000/api/v1/auth/new-password/${token}`

		await transporter.sendMail(htmlEmailForgotPassword(String(userDB.email), verificationLink))

		return res.status(200).json({ msg: 'Email sent successfully', token }) //TODO: retirar el token de la respuesta del enpoint
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			error: 'Something bad happened...',
		})
	}
}

export const newPassword = async (req: Request, res: Response) => {
	const { new_password } = req.body
	const token = req.headers['x-access-token']

	try {
		const { uid } = jwt.verify(String(token), String(SECRET_JWT)) as {
			uid: string
		}

		const userDB = await User.findOne({ uid })

		console.log(userDB)

		if (!userDB) {
			return res.status(400).json({
				msg: 'Something bad happened...',
			})
		}

		const salt = bcrypt.genSaltSync()
		userDB.password = bcrypt.hashSync(new_password, salt)

		await userDB.save()

		return res.status(200).json({
			msg: 'Password changed successfully',
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			error: 'Something bad happened...',
		})
	}
}

export const changePassword = async (req: Request, res: Response) => {
	const { email, password, new_password } = req.body

	try {
		let userDB = await User.findOne({ email })

		if (!userDB) {
			return res.status(400).json({ msg: 'Invalid email or password' })
		}

		const validPassword = bcrypt.compareSync(password, String(userDB.password))

		if (!validPassword) {
			return res.status(400).json({ msg: 'Invalid email or password' })
		}

		const salt = bcrypt.genSaltSync()
		userDB.password = bcrypt.hashSync(new_password, salt)

		await userDB.save()

		const token = await generarJWT(userDB.id, String(userDB.email))

		return res.status(200).json({
			user: {
				firstname: userDB.firstname,
				lastname: userDB.lastname,
				phone: userDB.phone,
				address: userDB.address,
				email: userDB.email,
				email_validated: userDB.email_validated,
			},
			token,
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			error: 'Something bad happened...',
		})
	}
}
