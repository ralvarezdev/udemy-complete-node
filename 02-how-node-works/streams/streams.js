import * as fs from "node:fs";
import * as http from "node:http";

const server = http.createServer();

server.on('request', (req, res) => {
    /*
    fs.readFile('test-file.txt', (err, data) => {
        if (err) console.log(err);
        res.end(data);
    })
     */

    /*
    const readable = fs.createReadStream('test-file.txt');
    readable.on('data', chunk => {
        res.write(chunk);
    })

    readable.on('end', () => {
        res.end();
    })

    readable.on('error', err => {
        console.log(err);
        res.statusCode = 500;
        res.end('File not found');
    })
     */

    const readable = fs.createReadStream('test-file.txt');
    readable.pipe(res)
})

server.listen(8000, 'localhost', () => {
    console.log('Waiting for requests...');
})