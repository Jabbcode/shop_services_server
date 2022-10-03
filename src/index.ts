import express from 'express'

import { dbConenction } from './config/db'
import dotenv from 'dotenv'

dotenv.config() // Configuracion de variables de entorno

dbConenction() // Conexion a la base de datos de MongoDB

const PORT = process.env.PORT

const app = express()

app.use(express.json())

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
