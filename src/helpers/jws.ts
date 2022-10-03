import jwt from 'jsonwebtoken'

const SECRET_JWT = process.env.SECRET_JWT

export const generarJWT = (uid: string, email: string) => {
	return new Promise((resolve, reject) => {
		const payload = { uid, email }

		jwt.sign(payload, String(SECRET_JWT), { expiresIn: '4h' }, (err, token) => {
			if (err) {
				console.log(err)
				reject('Failed to generate token')
			}
			resolve(token)
		})
	})
}
