const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(" New user connected:", socket.id);

    socket.on("invite", ({ sender, receiver }) => {
      console.log(` Invitation from ${sender} to ${receiver}`);
      io.to(receiver).emit("invite", { sender });
    });

    socket.on("disconnect", () => {
      console.log(" User disconnected:", socket.id);
    });
  });

  return io;
};
