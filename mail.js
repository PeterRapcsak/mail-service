const fs = require('fs')
 
fs.readFile('apikeys.txt', (err, data) => {
    if (err) throw err;
 
    console.log(data.toString());
})

