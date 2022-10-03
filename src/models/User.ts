import { prop, getModelForClass } from '@typegoose/typegoose'

class User {
	@prop({ required: true, trim: true }) // mongoose
	firstname: String // typescript

	@prop({ required: true, trim: true })
	lastname: String

	@prop({ required: true })
	phone: Number

	@prop({ required: true, trim: true })
	address: String

	@prop({ required: true, trim: true })
	email: String

	@prop({ required: true, minlength: 8 })
	password: String
}

const UserModel = getModelForClass(User)

export default UserModel
