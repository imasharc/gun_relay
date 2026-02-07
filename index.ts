import http from "node:http";
import Gun from "gun";

const PORT = process.env.PORT || 8765;

const server = http.createServer((req, res) => {
    // Standard CORS Headers for HTTP requests
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    };

    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers);
        res.end();
        return;
    }

    if ((Gun as any).serve(req, res)) { 
        return; 
    } 

    res.writeHead(200, headers);
    res.end('MediaHub Relay is Running!');
});

// Initialize Gun with "Cloud-Safe" defaults
const gun = Gun({ 
    web: server,
    file: 'radata',
    multicast: false, // Disable local network broadcasting (useless in cloud)
    axe: false,       // Disable mesh optimization (can cause data silos)
});

// --- DEBUGGING LOGS ---
console.log("Relay started. Waiting for data...");

// Log whenever a peer connects
gun.on('hi', (peer) => {
    console.log('👋 Peer connected!', peer);
});

// Log whenever data is received
gun.on('in', (msg) => {
    console.log('📨 Data received:', JSON.stringify(msg).substring(0, 100) + "...");
});

server.listen(PORT, () => {
    console.log(`Gun Relay running on port ${PORT}`);
});