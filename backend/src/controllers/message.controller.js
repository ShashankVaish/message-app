export function messageController(io, socket) {
  // Listen for message sent by client
  socket.on('send_message', (data) => {
    console.log('Received:', data);

    // Optionally save to DB or process

    // Broadcast to all clients
    io.emit('new_message', {
      id: data.id,
      text: data.text,
      time: new Date().toLocaleTimeString(),
    });
  });
}