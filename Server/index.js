// node server which will handle socket io connections
const http = require('http');
const server = http.createServer();

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000", // replace with your client domain
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
const users = {};

 io.on('connection', socket=>{
     socket.on('new-user-joined', name=>{
         console.log("New user", name);
         users[socket.id] = name;
         socket.broadcast.emit('user-joined', name);
     });

     socket.on('send', message=>{
         socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
     });

     socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
 })

// io.on('connection', socket => {
//   console.log('A user connected');

//   socket.on('new-user-joined', name => {
//     console.log('New user:', name);
//     users[socket.id] = { name, inCall: false };
//     socket.broadcast.emit('user-joined', name);
//   });

//   socket.on('send', message => {
//     socket.broadcast.emit('receive', { message, name: users[socket.id].name });
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//     if (users[socket.id].inCall) {
//       // if the user was in a call, emit a call ended event to end the call for all users
//       socket.broadcast.emit('call-ended', socket.id);
//     }
//     delete users[socket.id];
//   });

//   // handle video calls
//   socket.on('call-user', ({ to, offer }) => {
//     console.log(`User ${socket.id} calling ${to}`);
//     users[socket.id].inCall = true;
//     socket.to(to).emit('call-made', { offer, socket: socket.id });
//   });

//   socket.on('make-answer', ({ to, answer }) => {
//     console.log(`User ${socket.id} answering call from ${to}`);
//     socket.to(to).emit('answer-made', { answer, socket: socket.id });
//   });

//   socket.on('reject-call', ({ from }) => {
//     console.log(`User ${socket.id} rejecting call from ${from}`);
//     socket.to(from).emit('call-rejected');
//   });

//   socket.on('end-call', ({ to }) => {
//     console.log(`User ${socket.id} ending call with ${to}`);
//     socket.to(to).emit('call-ended', socket.id);
//     users[socket.id].inCall = false;
//   });
// });

server.listen(8000, () => {
  console.log('Server listening on port 8000');
});
