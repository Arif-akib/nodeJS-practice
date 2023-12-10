/*
 Title : check handlers
 Description : handler to handle user defined checks
 Author : akib
 Date : 10/12/2023
 */

// dependecies
const data = require('../../lib/data');
const { parseJSON , createRandomString } = require('../../helpers/utilities');
const tokenHandler = require('../routeHandlers/tokenHandler');



// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    // validate inputs
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;
    
    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;
    
    let successCodes = typeof (requestProperties.body.successCodes) === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof (requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;
    
    if (protocol && url && method && successCodes && timeoutSeconds) {
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        // look up the user phone by reading the token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                let userPhone = parseJSON(tokenData).phone;
                // lokkup the userdata
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                let userObject = parseJSON(userData);
                                let userChecks = typeof (userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                                if (userChecks.length < 5) {
                                    let checkId = createRandomString(20);
                                    let checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds,
                                    };
                                    // save the object
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            // add check id to the users object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            //save the new user data
                                            data.update('users', userPhone, userObject ,(err4) =>{
                                                if(!err4) {
                                                    // return the data about the new check
                                                    callback(200, checkObject);
                                                }else{
                                                    callback(500, {
                                                        error: 'there was a problem in server side',
                                                    }) 
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                error: 'there was a problem in server side',
                                            }) 
                                        }
                                    })
                                } else {
                                    callback(401, {
                                        error: 'user has already reached max limit',
                                    }) 
                                }
                            } else {
                                callback(403, {
                                    error: 'authenticathion fail',
                                }) 
                            }
                        })
                    } else {
                        callback(403, {
                            error: 'user not found',
                        }) 
                    }
                })
            } else {
                callback(403, {
                    error: 'authentication problem',
                })
            }
        } )
        
    } else {
        callback(400, {
            error: 'you have a problem with request',
        })
    }
};


handler._check.get = (requestProperties, callback) => {
     // check the id is valid
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length == 20 ? requestProperties.queryStringObject.id : false;
    
    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, parseJSON(checkData));
                    } else {
                        callback(403, {
                            error: 'authentication fail',
                        })
                    }
                });
            } else {
                callback(500, {
                    error : 'tere was a server side error',
                })
            }
        })
    } else {
        callback(400, {
            error : 'you have a problem in your request',
        })
    }
};

handler._check.put = (requestProperties, callback) => {
  // check the is valid
    
    
};

handler._check.delete = (requestProperties, callback) => {
   
};

module.exports = handler;