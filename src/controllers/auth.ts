import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import { generarJWT } from '../helpers/jws'

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body

	try {
		const userDB = await User.findOne({ email })

		if (!userDB) {
			return res.status(400).json({
				ok: false,
				msg: 'User or password invalid',
			})
		}

		const validPassword = bcrypt.compareSync(password, String(userDB.password))

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'User or password invalid',
			})
		}

		const token = await generarJWT(userDB.id, String(userDB.email))

		res.status(202).json({
			user: userDB,
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

		await newUser.save()

		const token = await generarJWT(newUser.id, String(newUser.email))

		return res.status(201).json({
			msg: 'Successfully Registered User',
			user: newUser,
			token,
		})
	} catch (error) {
		return res.status(500).json({
			msg: 'Something bad happened...',
		})
	}
}
