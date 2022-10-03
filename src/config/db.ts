import moongose from 'mongoose'

export const dbConenction = async () => {
	try {
		await moongose.connect(String(process.env.DB_CNN))
		console.log('DB Online')
	} catch (error) {
		throw new Error('Error when initializing DB')
	}
}
