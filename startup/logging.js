const winston = require('winston');
require('express-async-errors');
// require('winston-mongodb');

module.exports = function(){

winston.exceptions.handle(
    new winston.transports.Console({colorize:true,prettyPrint:true}),
    new winston.transports.File({filename:"uncaughtExceptions.log"}));

process.on('unhandledRejection', (ex)=>{
    throw ex;
});

winston.add(new winston.transports.File({ filename: 'logfile.log' }));


// winston.add(winston.transports.MongoDB, {
//     db:"mongodb://localhost/vidly",
//     level:"info",
// });
}