// Title:basic code app example
// Description: Simple node application that prints random quotes persecond setInterval
// Author: Akib
// Date:24/11/23

// dependencies
const { isUtf8 } = require('buffer');
const fs = require('fs');

// quotes object - module scaffolding 
const quotes = {};

// get all the quotes and return them
quotes.allQuotes = function allQuotes() {
    // read the text file containig quotes 
    const fileContents = fs.readFileSync(`${__dirname}/quotes.txt`, 'Utf8');

    // Turn the string into an array 
    const arrayOfQuotes = fileContents.split(/\r?\n/);

    // return the array 
    return arrayOfQuotes;
};

module.exports = quotes;