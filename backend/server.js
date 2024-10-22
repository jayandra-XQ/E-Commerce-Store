import express from 'express'
import 'dotenv/config'

import { connectDB } from './lib/db.js'


import authRoutes from './routes/auth.route.js'

const app = express()

const PORT = process.env.PORT || 5000;

app.use(express.json()); //alows you to parse the body of the request

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDB();
})