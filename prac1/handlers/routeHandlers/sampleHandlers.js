/*
 Title : sample handlers
 Description : sample handlers
 Author : akib
 Date : 28/11/2023
 */


// module scaffolding
const handler = {};

handler.smapleHandler = (requestProperties, callback) => {
    callback(200, {
        message : 'this is a sample url',
    });
};

module.exports = handler;