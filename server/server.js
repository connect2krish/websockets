var ws = require("nodejs-websocket")

var server = ws.createServer(function (conn) {
    console.log("New connection")
    conn.on("text", function (str) {
        console.log("Received "+str)
        for(var i=0;i<100;i++) {
          console.log(i);
          conn.sendText(i + "!!!");
        }
        conn.sendText(str.toUpperCase()+"!!!")
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)

server.connections.forEach(function (conn) {
        conn.sendText("hello how are you?")
    })
