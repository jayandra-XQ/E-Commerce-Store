import express from 'express'
import 'dotenv/config'


import authRoutes from './routes/auth.route.js'

const app = express()

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})