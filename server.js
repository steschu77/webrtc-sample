const WebSocket = require('ws');

const wssPort = 8080;
const wss = new WebSocket.Server({port: wssPort});

const clients = new Array;

var offer;

wss.on('connection', (client, request) => {

    clients.push(client);

    console.log(`request: ${request.url}`);

    if (offer) {
        client.send(JSON.stringify({offer: offer}));
    }

    client.on('message', (data) => {
        const msg = JSON.parse(data);

        // store last offer for late/reconnected receiver
        offer = msg.offer || offer;

        // broadcast the change
        for (c in clients) {
            if (clients[c] != client) {
                clients[c].send(JSON.stringify(msg));
            }
        }
    });

    client.on('close', () => {
        var position = clients.indexOf(client);
        clients.splice(position, 1);
        console.log("connection closed");
    });
});

