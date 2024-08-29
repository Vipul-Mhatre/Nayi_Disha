const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require('cors')
const cookie_parser = require('cookie-parser')


dotenv.config({ path: './.env'})
const PORT = process.env.PORT

require('./db/connnection')
const User = require('./model/userSchema')
app.use(cors())
app.use(cookie_parser())
app.use(express.json())

app.use(require('./router/routes'))

app.get('/' , (req,res) => res.send("Hello"));

app.listen( PORT , () => console.log(`port ${PORT} running`) );