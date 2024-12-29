import dotenv from "dotenv"
import { connect } from "mongoose"

dotenv.config()

const MONGO_URL = process.env.MONGO_URL
const MONGO_DB_NAME = process.env.MONGO_DB_NAME
const MONGO_CONNECTION_URL = `mongodb://${MONGO_URL}`

connect(MONGO_CONNECTION_URL, {
  dbName: MONGO_DB_NAME,
  family: 4
})
  .then(() => console.log("DB Connection Ok"))
  .catch(e => console.log(e))