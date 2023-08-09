const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate =  require('./modules/replaceTemplate');
const slugify = require('slugify')
const overviewTemp = fs.readFileSync('./starter/templates/template-overview.html','utf-8');
const cartTemp = fs.readFileSync('./starter/templates/template-cart.html','utf-8');
const productTemp = fs.readFileSync('./starter/templates/template-product.html','utf-8');
  


const data = fs.readFileSync('./starter/dev-data/data.json','utf-8');
let dataObj = JSON.parse(data);
dataObj = dataObj.map((data) => {
    return {
        ...data,
        route: slugify(data.productName,{lower: true,})
    }
})
const server = http.createServer((req,res) => { 
    const {pathname,query} = url.parse(req.url,true);
    const productRoute = Object.keys(query)[0];
    //OVERVIEW
    if(pathname === '/' || pathname === '/overview'){
        const cardHtmls = dataObj.map((element) => (replaceTemplate(cartTemp,element))).join('');
        const output = overviewTemp.replace('{%PRODUCT_CART%}',cardHtmls);
        res.writeHead(200,{
            'content-type':'text/html'
        })
        res.end(output);
    } // PRODUCT
    else if(pathname === '/product' && productRoute){
        let productHtmls = '';
        for(let dat of dataObj){
            if(dat.route === productRoute){
                productHtmls = replaceTemplate(productTemp,dat);
                break;
            }
        }
        res.writeHead(200,{
            'content-type':'text/html'
        })
        res.end(productHtmls);
    } // API
    else if(pathname === '/api'){
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(data);
    }
    else{
        res.writeHead(404,{
            'Content-Type':'text/html',
            'my-own':'cua  tao'
        });
        res.end('<h1>Page not found</h1>');
    }
})
server.listen(8000,'127.0.0.1', () => {
    console.log('Listening to request on port 8000');
})
