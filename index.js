const io = require("socket.io")(process.env.PORT || 8900, {
  cors: {
    origin: "https://mybestportfolio.herokuapp.com",
  },
});
 
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  console.log('adddusser     users: ', users);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
  console.log('removeusser     users: ', users);
};

const removeUserbyId = (userId) => {
  users = users.filter((user) => user.userId !== userId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log('user', users);

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    console.log('print received id', receiverId);
    const user = getUser(receiverId);
    console.log('print user ', user);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("removeUser", (userId) => {
    removeUserbyId(userId);
    io.emit("getUsers", users);
  });

  //when disconnect 
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
