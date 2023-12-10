//dependencies
const fs = require('fs');
const path = require('path');

//module scaffolding
const lib = {};

//base detectory of the data folder
lib.basedir = path.join(__dirname, '/.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    console.log(lib.basedir)
    //file open for writing
    fs.open(lib.basedir+dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            //write data to file and the close it
            fs.write(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error closing the new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            })
        } else {
            callback('there was an error , file may already  exist');
        }
    });
};


//  read data of a file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.basedir + dir + '/' + file + '.json', 'utf-8', (err, data) => {
        callback(err, data);
    })
};

// update existing file
lib.update = (dir, file, data, callback) => {
    // file open for writing

    fs.open(lib.basedir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);
            //turncate the file
            fs.ftruncate(fileDescriptor, (err1) => {
                if (!err1) {
                    //write to file and close it 
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if (!err2) {
                            //close the file 
                            fs.close(fileDescriptor, (err3) => {
                                if (!err3) {
                                    callback(false);
                                } else {
                                    callback('error closing the file');
                                }
                            })
                        } else {
                            callback('error writing to file');
                        }
                    })
                } else {
                    callback('error truncating file')
                }
            })
        } else {
            callback('error updating file may not exist')
        }
    });
}


// delete existing file
lib.delete = (dir, file, callback) => {
    fs.unlink(lib.basedir + dir + '/' + file + '.json', (err) =>{
        if (!err) {
            callback(false);
        } else {
            callback('error deleting file');
        }
    })
}

module.exports = lib;