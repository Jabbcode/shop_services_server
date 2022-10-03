import express from 'express'
import authRouter from './routes/auth'
import { dbConnection } from './config/db'
import dotenv from 'dotenv'

dotenv.config() // Configuracion de variables de entorno

dbConnection() // Conexion a la base de datos de MongoDB

const PORT = process.env.PORT

const app = express()

app.use(express.json())

app.use('/api/v1/auth', authRouter)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
