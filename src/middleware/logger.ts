import express from "express"

const logger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { method, path, params, body } = req
  const date = new Date().toISOString()
  let log = `[${date}] ${method.toUpperCase()} ${path}`

  if (!!Object.keys(params).length) {
    log += ` ${JSON.stringify(params)}`
  }

  if (body) {
    log += ` - ${JSON.stringify(body)}`
  }

  console.log(log)
  next()
}

export default logger