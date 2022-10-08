import { Router } from 'express'
import { changePassword, forgotPassword, login, newPassword, register, verifyEmail } from '../controllers/auth'
import { validarCampos } from '../middlewares/validar-campos'
import { check } from 'express-validator'

const router = Router()

router.post(
	'/login',
	[
		check('email', 'El correo electronico es obligatorio').isEmail(),
		check('password', 'la contraseña es obligatoria').not().isEmpty(),
		check('password', 'La constraseña debe contener minimo 8 caracteres').isLength({ min: 8 }),
		validarCampos,
	],
	login
)

router.post(
	'/register',
	[
		check('firstname', 'El nombre es obligatorio').not().isEmpty(),
		check('lastname', 'El apellido es obligatorio').not().isEmpty(),
		check('phone', 'El numero de telefono es obligatorio').not().isEmpty(),
		check('address', 'La direccion es obligatoria').not().isEmpty(),
		check('email', 'El correo electronico es obligatorio').isEmail(),
		check('password', 'la contraseña es obligatoria').not().isEmpty(),
		check('password', 'La constraseña debe contener minimo 8 caracteres').isLength({ min: 8 }),
		validarCampos,
	],
	register
)

router.put('/verify-email', verifyEmail)

router.post('/forgot-password', [check('email', 'El correo electronico es obligatorio').not().isEmpty(), validarCampos], forgotPassword)

router.post(
	'/new-password',
	[
		check('new_password', 'Agregue su nueva contraseña').not().isEmpty(),
		check('new_password', 'La constraseña debe contener minimo 8 caracteres').isLength({ min: 8 }),
		validarCampos,
	],
	newPassword
)

router.post(
	'/change-password',
	[
		check('email', 'El correo electronico es obligatorio').not().isEmpty(),
		check('password', 'La contraseña es obligatoria').not().isEmpty(),
		check('password', 'La constraseña debe contener minimo 8 caracteres').isLength({ min: 8 }),
		validarCampos,
	],
	changePassword
)

export default router
