/*
 Title : user handlers
 Description : handler to handle user related routes
 Author : akib
 Date : 5/12/2023
 */

// dependecies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('../routeHandlers/tokenHandler');
// const { user } = require('../../router/routes');
// const { error } = require('console');


// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._user = {};

handler._user.post = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof (requestProperties.body.tosAgreement) == 'boolean' && requestProperties.body.tosAgreement.length > 0 ? requestProperties.body.tosAgreement : false;

    if (phone) {
        // make sure user does not already exists
        data.read('users', phone, (err1,) => {
            if (err1) {
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password : hash(password),
                    tosAgreement,
                };
                //store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200,{
                            message : 'user was created sucessfully',
                        });
                    } else {
                        callback(500 ,{
                            error: 'could not create user',
                        });
                    }
                })
            } else {
                callback(500, {
                    error : "there was a problem in sevrer side",
                })
            }
        });
    } else {
        callback(400, {
            error: 'you have a problem in request',
        })
    }
};

handler._user.get = (requestProperties, callback) => {
    // check the phone number is valid
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length == 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {
        // verify token
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                    // look up the user
                data.read('users', phone, (err, u) => {
                    // using spread operator to copy valid object
                    const user = { ...parseJSON(u) };
                    
                    if(!err && user){
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'requested uers no found',
                        });
                    }
                })
            } else {
                callback(403, {
                    error : 'authentication failed 3'
                })
            }
        })

    } else {
        callback(404, {
            error: 'requested uers not found',
        })
    }
};

handler._user.put = (requestProperties, callback) => {
  // check the is valid
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;  
    
    if (phone) {
        if (firstName || lastName || password) {
        // verify token
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // lookup the user
                data.read('users', phone, (err1, uData) => {
                    const userData = { ...uData };
                    if(!err1 && userData) {
                        if (firstName) {
                            userData.firstName = firstName;
                        }
                        if (lastName) {
                            userData.lastName = lastName;
                        }
                        if (password) {
                            userData.password = hash(password);
                        }
                        // store to db
                        data.update('users', phone, userData, (err2) => {
                            if (!err2) {
                                callback(200, {
                                message : 'user was updated successfully',
                            }) 
                            } else {
                                callback(500, {
                                    error : 'there was a problem in server side',
                                })
                            }
                        })

                    }else{

                        callback(400 , {
                            error: 'problem with request1',
                            
                        });
                    }
                })
            } else {
                callback(403, {
                    error : 'authentication failed'
                })
            }
        })   
        } else {
            callback(400, {
                error: 'problem with request2',
            })
        }
    } else {
        callback(400, {
            error : 'invalid phone number3',
        })
    }
    
};

handler._user.delete = (requestProperties, callback) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length == 11 ? requestProperties.queryStringObject.phone : false;
    
    if (phone) {
        // verify token
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;
        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                  //delete user
                data.read('users', phone, (err1, userData) => {
                    if (!err1 && userData) {
                        data.delete('users', phone, (err2) =>{
                            if (!err2) {
                                callback(200 ,{
                                    message:'user was deleted'
                                })
                            } else {
                                callback(500, {
                                    error :'there was server side error',
                                })
                        }
                    })
                    } else {
                        callback(500, {
                            error :'there was server side error',
                        })
                }
                })
            } else {
                callback(403, {
                    error : 'authentication failed'
                })
            }
        })
    } else {
        callback(400, {
            error : 'there was aproblem is request'
        })
    }
};

module.exports = handler;