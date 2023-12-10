/*
 Title : handle request response
 Description : handle request response
 Author : akib
 Date : 28/11/2023
 */


//dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const { buffer } = require('buffer');
const routes = require('../router/routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('../helpers/utilities');

//modecle scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    //request handling
    //get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    // console.log (parsedUrl);
    const path = parsedUrl.pathname;
    const trimedPath = path.replace(/^\/+|\?+$/g, '');
    // console.log(trimedPath);
    const method = req.method.toLowerCase();
    // console.log(method);
    const queryStringObject = parsedUrl.query;
    // console.log(queryStringObject);
    const headersObject = req.headers;
    // console.log(headersObject);

    const requestProperties = {
        parsedUrl,
        trimedPath,
        path,
        method,
        queryStringObject,
        headersObject,
    };


    const decoder = new StringDecoder('utf-8');
    let realData = '';


    const chosenHandler = routes[trimedPath] ? routes[trimedPath] : notFoundHandler; 


    

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();
        
        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
            payload = typeof (payload) === 'object' ? payload : {};
    
            const payloadString = JSON.stringify(payload); 
    
            

            // return final response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
    
   
}


module.exports = handler;