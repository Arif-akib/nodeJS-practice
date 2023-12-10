/*
 Title : Uptime Monitoring Application
 Description : A RESTful API to monitor up or down time of user defined links
 Author : akib
 Date : 28/11/2023
 */


//depennies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const data = require('./lib/data');


//app obeject - module scuffolding
const app = {};

//configyaration section
app.config = {
    port : 3000
};

app.handleReqRes = handleReqRes;

//create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listen to port ${app.config.port}`);
    });
}

//handel request response


//start server
app.createServer();