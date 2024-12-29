import dotenv from "dotenv"
import express from "express"
import cors from "cors"

import logger from "@/middleware/logger"
import usersRouter from "@/routers/users"
import boardsRouter from "@/routers/boards"
import tasksRouter from "@/routers/tasks"
import columnsRouter from "@/routers/columns"
import "@/db/mongo"

dotenv.config()

const port = process.env.PORT || 3000
const isLoggerOn = !!process.env.LOGGER

const app = express()

app.use(express.json())
app.use(cors())

if (isLoggerOn) {
  app.use(logger)
}

app.use(usersRouter)
app.use(boardsRouter)
app.use(tasksRouter)
app.use(columnsRouter)

app.listen(port, () => {
  console.log(`Kanban API is up and running on port ${port}`)
})