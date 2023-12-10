// Title:basic code app example
// Description: Simple node application that prints random quotes persecond setInterval
// Author: Akib
// Date:24/11/23

// math object - module scaffolding
const math = {};


// get random number function
math.getRandomNumber = function getRandomNumber(min, max) {
    let minimum = min;
    let maximum = max;
    
    minimum = typeof minimum === 'number' ? minimum : 0;
    maximum = typeof maximum === 'number' ? maximum : 0;
    return Math.floor(Math.random() * (maximum - minimum + 1) + min);
};

// export the library 
module.exports = math;

// console.log(math)