import * as http from "node:http";
import * as fs from "node:fs";
import * as url from "node:url";
import replaceTemplate from "./lib/replaceTemplate.js";

const data = fs.readFileSync('./dev-data/data.json', 'utf-8')
const productData = JSON.parse(data)
const templateOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8')
const templateCard = fs.readFileSync('./templates/template-card.html', 'utf-8')
const templateProduct = fs.readFileSync('./templates/template-product.html', 'utf-8')

const server = http.createServer((req, res) => {
    const {query, pathname: pathName} = url.parse(req.url, true)

    if (pathName === '/' || pathName === '/overview') {
        // res.end('This is the overview')
        res.writeHead(200, {'Content-type': 'text/html'})

        const cardsHTML = productData.map(el => replaceTemplate(templateCard, el)).join('')
        res.end(templateOverview.replace(/%PRODUCT_CARDS%/g, cardsHTML))

    } else if (pathName === '/product') {
        const product = productData.find(el => String(el.id) === query.id)
        const output = replaceTemplate(templateProduct, product)

        res.writeHead(200, {'Content-type': 'text/html'})
        res.end(output)
    } else if (pathName === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end('<h1>Page not found</h1>')
    }
})

server.listen(8000, 'localhost', () => {
    console.log('Listening to requests on port 8000')
})