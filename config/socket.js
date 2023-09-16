const { Server } = require('socket.io')
const PORT = process.env.PORT || 3002

const io = new Server(
    {
        pingTimeout: 60000,
        cors: 
        {
            origin: 'http://localhost:3000'
        }
    })

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.join(socket.id)
    //console.log(socket.id)
});

//@ts-ignore
io.listen(PORT)

module.exports = io