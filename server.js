// server.js
import { createServer } from 'json-server'

const server = createServer({
  database: 'db.json',
  routes: 'routes.json', // opsional, kalau kamu punya custom route
  port: 3001,
})

server.start()
