export const htmlEmailVerify = (user_email: string, verification_link: string) => {
	return {
		from: 'Verificar Correo Electronico - Shop Services',
		to: user_email,
		subject: 'Verificar Correo electronico',
		html: `
        <span>Porfavor clique en el siguiente enlace o copielo y peguelo en su navegador para terminar el proceso</span>
        <a href="${verification_link}">${verification_link}<a/>
        `,
	}
}

export const htmlEmailForgotPassword = (user_email: string, verification_link: string) => {
	return {
		from: 'Olvido de contraseña - Shop Services',
		to: user_email,
		subject: 'Olvido de contraseña',
		html: `
        <b>Porfavor clique en el siguiente enlace o copielo y peguelo en su navegador para terminar el proceso</b>
        <a href="${verification_link}">${verification_link}<a/>
        `,
	}
}
