
const express = require('express');
const winston = require('winston');

const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();


const port = process.env.PORT || 8080;
const server=app.listen(port, () => winston.info(`app is listening on port ${port}`));
module.exports =server;


