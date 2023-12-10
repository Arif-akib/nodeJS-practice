/*
 Title : not found handlers
 Description : not found handlers
 Author : akib
 Date : 28/11/2023
 */


// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties , callback) => {
    callback(404, {
        message : 'your requested url not found'
    });
};

module.exports = handler;