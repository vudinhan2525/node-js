const EventEmitter = require('events');
const http = require('http');
class Sales extends EventEmitter{
    constructor(){
        super();
    }
}
const myEmitter = new Sales();
myEmitter.on('newSale',(props) => {
    console.log(props);
    console.log('There is a new sale???');
})
myEmitter.emit('newSale',9);

/////

const server = http.createServer();
server.on('request',(req,res) => {
    console.log('Request received');
    res.end('Request received');

})
server.on('request',(req,res) => {
    console.log('Another request received');
})
server.on('close',() => {
    console.log('Server closed!!!');
})
server.listen(8000,'127.0.0.1',() => {
    console.log('Listening from port 8000 ....');
})