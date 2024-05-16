import express from 'express'
import {createPool} from 'mysql2/promise'
import {config} from 'dotenv'
config()

const app = express ()

console.log({
    host:process.env.MYSQLDB_HOST,
    password: process.env.MYSQLDB_PASSWORD,
    port: process.env.MYSQLDB_DOCKER_PORT,
})

const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: 'root',
    password: process.env.MYSQLDB_PASSWORD,
    port: process.env.MYSQLDB_PORT,

})

app.get('/',(req, res) => {
    res.send('Hola mundo')
})

app.get('/hora',async (req, res) => {
    const result = await pool.query('SELECT NOW()')
    res.json(result[0])

})

app.listen(3000)
console.log('Anda en el puerto',3000)
