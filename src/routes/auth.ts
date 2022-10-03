import { Router } from 'express'
import { login, register } from '../controllers/auth'
import { validarCampos } from '../middlewares/validar-campos'
import { check } from 'express-validator'

const router = Router()

router.post(
	'/login',
	[
		check('email', 'El correo electronico es obligatorio').isEmail(),
		check('password', 'la contraseña es obligatoria').not().isEmpty(),
		// check('password', 'La constraseña debe contener minimo 8 caracteres').isLength(),
		validarCampos,
	],
	login
)

router.post(
	'/register',
	[
		check('fistname', 'El nombre es obligatorio').not().isEmpty(),
		check('lasttname', 'El apellido es obligatorio').not().isEmpty(),
		check('phone', 'El numero de telefono es obligatorio').not().isEmpty(),
		check('address', 'La direccion es obligatoria').not().isEmpty(),
		check('email', 'El correo electronico es obligatorio').isEmail(),
		check('password', 'la contraseña es obligatoria').not().isEmpty(),
		// check('password', 'La constraseña debe contener minimo 8 caracteres').isLength(),
		validarCampos,
	],
	register
)

export default router
