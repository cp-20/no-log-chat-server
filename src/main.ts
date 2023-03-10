import { serve } from 'https://deno.land/std@0.156.0/http/server.ts';

const clients = new Map<number, WebSocket>();
const usernames = new Map<number, string>();
let clientId = 0;

const sendMessageToAll = (message: string) => {
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });

  console.log(JSON.parse(message));
};

const memberUpdateMessage = () =>
  JSON.stringify({
    type: 'memberUpdate',
    data: {
      members: Array.from(usernames.values()),
    },
  });

const memberUpdate = () => {
  sendMessageToAll(memberUpdateMessage());
};

const wsHandler = (ws: WebSocket) => {
  const id = ++clientId;
  clients.set(id, ws);
  ws.onopen = () => {
    console.log('connected');

    ws.send(memberUpdateMessage());
  };
  ws.onmessage = (e) => {
    const payload = JSON.parse(e.data);

    if (payload.type === 'message') {
      sendMessageToAll(e.data);
    }
    if (payload.type === 'join') {
      usernames.set(id, payload.data.author);
      sendMessageToAll(e.data);

      memberUpdate();
    }
    if (payload.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' }));
    }
  };
  ws.onclose = () => {
    clients.delete(id);
    console.log('disconnected');

    const username = usernames.get(id);
    if (username) {
      sendMessageToAll(
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

    memberUpdate();
  };
};

serve(
  (req) => {
    const { response, socket } = Deno.upgradeWebSocket(req);

    wsHandler(socket);

    return response;
  },
  { port: parseInt(Deno.env.get('PORT') ?? '') || 443 }
);
