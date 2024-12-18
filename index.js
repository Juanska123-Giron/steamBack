//const express = require("express");
import express from "express"
import conectarDB from "./config/db.js"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import paymentCardRoutes from "./routes/paymentCardRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import gameRoutes from "./routes/gameRoutes.js"
import countryRoutes from "./routes/countryRoutes.js"
import requirementsRoutes from "./routes/requirementsRoutes.js"
import libraryRoutes from "./routes/libraryRoutes.js"
import cors from "cors"

const app = express()

app.use(express.json())

app.use(cors({}))

dotenv.config()

conectarDB()

//Routing
app.use("/api/country", countryRoutes)
app.use("/api/users", userRoutes)
app.use("/api/payment-cards", paymentCardRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/games", gameRoutes)
app.use("/api/requirements", requirementsRoutes)
app.use("/api/library", libraryRoutes)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
