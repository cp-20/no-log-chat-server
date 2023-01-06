import { serve } from 'https://deno.land/std@0.156.0/http/server.ts';

const clients = new Map<number, WebSocket>();
const usernames = new Map<number, string>();
let clientId = 0;

const sendMessage = (message: string) => {
  clients.forEach((client) => {
    client.send(message);
  });

  console.log(JSON.parse(message));
};

const wsHandler = (ws: WebSocket) => {
  const id = ++clientId;
  clients.set(id, ws);
  ws.onopen = () => {
    console.log('connected');
  };
  ws.onmessage = (e) => {
    const payload = JSON.parse(e.data);

    if (payload.type === 'join') {
      usernames.set(id, payload.data.author);
    }
    sendMessage(e.data);
  };
  ws.onclose = () => {
    clients.delete(id);

    const username = usernames.get(id);
    if (username) {
      sendMessage(
        JSON.stringify({
          type: 'left',
          data: {
            author: usernames.get(id),
            ts: Date.now(),
          },
        })
      );
    }
    usernames.delete(id);
  };
};

serve(
  (req) => {
    const { response, socket } = Deno.upgradeWebSocket(req);

    wsHandler(socket);

    return response;
  },
  { port: 443 }
);
