/*
 Title : routes
 Description : application routes
 Author : akib
 Date : 28/11/2023
 */

// dependencies
const { smapleHandler } = require('../handlers/routeHandlers/sampleHandlers');
const { userHandler } = require('../handlers/routeHandlers/userHandler');
const { tokenHandler } = require('../handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('../handlers/routeHandlers/checkHandler');


const routes = {
   sample: smapleHandler, 
   user: userHandler,
   token: tokenHandler,
   check: checkHandler,
};

module.exports = routes;