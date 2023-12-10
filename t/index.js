// Title:basic code app example
// Description: Simple node application that prints random quotes persecond setInterval
// Author: Akib
// Date:24/11/23

// Dependencies
const mathLibrary = require('./lib/math');
const quotesLibrary = require('./lib/quotes');


// App object - Module scaffolding
const app = {};

// configuration
app.config = {
    timeBetweenQuotes: 1000,
};


app.printAQuote = function printAQuote() {

    // get all quotes
    const allQuotes = quotesLibrary.allQuotes();

    // get length of the quotes 
    const numberOfQuotes = allQuotes.length;

    // pick a random number 
    const randomNumber = mathLibrary.getRandomNumber(1, numberOfQuotes);

    // get the number in the position 
    const selectdQuotes = allQuotes[randomNumber - 1];

    // print the quotes 
    console.log(selectdQuotes);
};

// function thatloop infinite times 
app.indifiniteLoop = function indifiniteLoop() {
    // create the interval using the config variable defined above
    setInterval(app.printAQuote, app.config.timeBetweenQuotes);
};

app.indifiniteLoop();