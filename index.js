const io = require("socket.io")(8000, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-app-akib.web.app",
      "https://chat-app-akib.firebaseapp.com",
    ],
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  //! Add new User
  socket.on("new-user-add", (newUserId) => {
    //if user not added previously
    if (!activeUsers.some((user) => user.userId == newUserId) && newUserId) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("Connected User", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const receiver = activeUsers.find((user) => user.userId == receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("receive-message", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId != socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});
