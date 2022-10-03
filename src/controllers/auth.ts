import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User'

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body

	try {
		const userDB = await User.findOne({ email })

		if (!userDB) {
			return res.status(400).json({
				ok: false,
				msg: 'Usuario o contraseña Invalidos',
			})
		}

		const validPassword = bcrypt.compareSync(password, String(userDB.password))

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Usuario o contraseña Invalidos',
			})
		}

		//TODO: Agregar token

		res.status(202).json({
			user: userDB,
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

		await newUser.save()

		//TODO: Agregar token

		return res.status(201).json({
			msg: 'Successfully Registered User',
			user: newUser,
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Something bad happened...',
		})
	}
}
