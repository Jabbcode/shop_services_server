import mongoose from 'mongoose'

export const dbConnection = async () => {
	try {
		await mongoose.connect('mongodb://localhost/shop_services')
		console.log('DB Online')
	} catch (error) {
		console.log(error)
		throw new Error('Error when initializing DB')
	}
}
