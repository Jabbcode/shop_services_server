import { Request, Response } from 'express'
import { validationResult } from 'express-validator'

export const validarCampos = (req: Request, res: Response, next: any) => {
	const results = validationResult(req)

	if (results['errors'].length > 0) {
		return res.status(400).json(results['errors'])
	}

	next()
}
