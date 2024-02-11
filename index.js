const { Server } = require('socket.io')
const port = process.env.PORT || 3000;

const io = new Server(port, { cors: { origin: ['http://localhost:5173','https://gobblet-gobbler-online.vercel.app/'] } })


io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.on('create-room', (roomId, cb) => {
    socket.join(roomId)
    cb(`Created a room id ${roomId}`)
  })

  socket.on('join-room', async (roomId, cb) => {
    const sockets = await io.in(roomId).fetchSockets();
    if (sockets.length === 0) {
      cb(false, `No room found for room id ${roomId}`)
    } else if (sockets.length > 1) {
      cb(false, `You can not join room id ${roomId}`)
    } else {
      socket.join(roomId)
      socket.to(roomId).emit('joined')
      cb(true, `Joined room id ${roomId}`)
    }
  })

  socket.on('update-game', (roomId, playedMove, index) => {
    socket.to(roomId).emit('update-game', playedMove, index)
  })

  socket.on('won-game', (roomId, playedMove, index, winningLine) => {
    socket.to(roomId).emit('won-game', playedMove, index, winningLine)
  })

  socket.on('reset', (roomId) => {
    socket.to(roomId).emit('reset')
  })

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});
