const https = require('https');
const fs = require('fs');
const path = require('path');
const ws = require('ws');

const httpsServer = https.createServer({
  key: fs.readFileSync('./https-key.pem'),
  cert: fs.readFileSync('./https-cert.pem')
});

const wssServer = new ws.Server({
  server: httpsServer
});

httpsServer.on('request', (req, res) => {
  console.log('Request for ' + req.url + ' by method ' + req.method);

  res.writeHead(200, {'Content-Type': 'text/html'});

  const filePath = path.resolve("." + req.url);
  fs.exists(filePath, (exists) => {
    if (exists) {
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.end();
    }
  });
});

const clients = new Array;
var storedOffer;

wssServer.on('connection', (client, req) => {

  clients.push(client);

  console.log(`request: ${req.url}`);

  if (storedOffer) {
    client.send(JSON.stringify({offer: storedOffer}));
  }

  client.on('message', (data) => {
    const msg = JSON.parse(data);

    // store last offer for late/reconnected receiver
    storedOffer = msg.offer || storedOffer;

    // broadcast the change
    for (c in clients) {
      if (clients[c] != client) {
        clients[c].send(JSON.stringify(msg));
      }
    }
  });

  client.on('close', () => {
    clients.splice(clients.indexOf(client), 1);
    console.log("connection closed");
  });
});

const port = 3000;
httpsServer.listen(port);
