require('dotenv').config();
const express = require('express');
const app = express();
const mongoConnect = require('./db');
const cors = require('cors');
const routes = require('./Routes/router');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(routes);

mongoConnect(process.env.MONGO_URL).then(() => {
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
