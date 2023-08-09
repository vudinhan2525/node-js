const fs = require('fs');
const crypto = require('crypto');
process.env.UV_THREADPOOL_SIZE = 1;
const start = Date.now();
setTimeout(() => {
    console.log(1);
},0)
setImmediate(() => {
    console.log('Imediate 1 finished');
})
fs.readFile('test-file.txt',() => {
    console.log('I/O finished');
    console.log('--------------------------');
    setTimeout(() => {
        console.log("Timer1");
    },0)
    setTimeout(() => {
        console.log('Timer2');
    },3000)
    setImmediate(() => { console.log('Imediate 2 finished');})

    crypto.pbkdf2('password','salt',100000,1024,'sha512',() => {
        console.log(Date.now() - start);
    })
    crypto.pbkdf2('password','salt',100000,1024,'sha512',() => {
        console.log(Date.now() - start);
    })
    crypto.pbkdf2('password','salt',100000,1024,'sha512',() => {
        console.log(Date.now() - start);
    })
    crypto.pbkdf2('password','salt',100000,1024,'sha512',() => {
        console.log(Date.now() - start);
    })
})
console.log('Hello from the top level code');