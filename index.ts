import http from "node:http";
import Gun from "gun";

// Bun automatically loads .env files, so this works out of the box
const PORT = process.env.PORT || 8765;

const server = http.createServer((req, res) => {

    // Handle CORS (Allow Vercel to talk to Railway)
    // We add these headers to EVERY response
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allow ALL domains (or put your Vercel URL here)
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'text/plain'
    };
  
    // Gun.serve returns true if it handles the request
    // We cast to 'any' here because Gun's types can be strict about http types
    if ((Gun as any).serve(req, res)) { 
        return; 
    } 

    res.writeHead(200);
    res.end('MediaHub Relay is Running!');
});

// Initialize Gun
const gun = Gun({ 
    web: server,
    file: 'radata' // This ensures data persists to disk in a 'radata' folder
});

server.listen(PORT, () => {
    console.log(`Gun Relay running on http://localhost:${PORT}`);
});