/*
 Title : utiities
 Description : important utilities function
 Author : akib
 Date : 5/12/2023
 */


// dependecies
const { json } = require("stream/consumers");
const crypto = require('crypto');


// module scaffolding
const utiities = {};

// parse json string to object
utiities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};


// hash string
utiities.hash = (str) => {
    if (typeof (str) === 'string' && str.length > 0) {
        let hash = crypto.createHmac('sha256', 'password').update(str).digest('hex');
        return hash;
    } else {
        return false;
   }
};

// create random string
utiities.createRandomString = (strlenght) => {
    let lenght = strlenght;
    lenght = typeof (strlenght) === 'number' && strlenght > 0 ? strlenght : false;

    if (lenght) {
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (i = 1; i <= lenght; i++){
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            output += randomCharacter;
        }
        return output;
        
    } else {
        return false;
    }
}


// export module
module.exports = utiities;