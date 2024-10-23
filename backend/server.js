const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const rules = require('./routes/rules');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

connectDB();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/rules', rules);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
