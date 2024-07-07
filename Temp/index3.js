const http = require('http');

const EventEmitter = require("events");

const emitter = new EventEmitter();

const encrypt = require("./encrypt");


emitter.on('errorLogger', (message) => {
    const errorMessage = `${new Date().toISOString()} => ${message}\n`;

    fs.appendFile('ErrorLogger.txt', errorMessage, (err) => {
        if (err) {
            console.log('Error:', err)
        }
    });
});

emitter.on("encryptString", async (data) => {
    try {
        const value = await encrypt.encryptString(data);
        console.log(value);
    } catch (error) {
        console.error("Error:", error);
        emitter.emit('errorLogger', `Error in encryptString: ${error.message}`);
    }
});

emitter.on("compareString", async (data) => {
    try {
        const { originalString, hash } = data;
        const value = await encrypt.compareString(originalString, hash);
        console.log(value);
    } catch (error) {
        console.error("Error:", error);
        emitter.emit('errorLogger', `Error in compareString: ${error.message}`);
    }
});

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/encrypt") {
        req.on("data", (chunk) => {
            body += chunk.toString();
            emitter.emit("encryptString", body);
        })
        req.on("end", () => {
            res.writeHead(200);
            res.end(body);
        });
    }
    else if (req.method === "POST" && req.url === "/compare") {
        req.on("data", (chunk) => {
            body += chunk.toString();
            emitter.emit("compareString", body);
        });
        req.on("end", () => {
            res.writeHead(200);
            res.end(body);
        });
    }
    else {
        emitter.emit('errorLogger', notFoundMessage);
        res.writeHead(404);
        res.end("Not found");
    }
})



server.listen(4000, () => {
    console.log(`Port: ${4000}`);
});