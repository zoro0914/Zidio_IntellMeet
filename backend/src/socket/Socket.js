const rooms = {};

module.exports = (io) => {
  io.on("connection", (socket) => {

    // =====================================
    // JOIN ROOM
    // =====================================

    socket.on("join-room", ({ roomId, userName, peerId, userId }) => {

      socket.join(roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          users: [],
          messages: [],
        };
      }

      // Existing users before adding current user
      const existingUsers = [...rooms[roomId].users];

      // Send existing users to new user
      socket.emit("existing-users", existingUsers);

      // Add new user
      rooms[roomId].users.push({
        socketId: socket.id,
        peerId,
        name: userName,
        userId,
        raisedHand: false,
      });

      // Notify existing users
      socket.to(roomId).emit("user-connected", peerId);

      // Update participants
      io.to(roomId).emit(
        "participants-update",
        rooms[roomId].users
      );

      // Send old chat
      socket.emit(
        "chat-history",
        rooms[roomId].messages
      );
    });

    // =====================================
    // LEAVE ROOM
    // =====================================

    socket.on("leave-room", ({ roomId, peerId }) => {

      if (!rooms[roomId]) return;

      rooms[roomId].users = rooms[roomId].users.filter(
        (user) => user.peerId !== peerId
      );

      socket.to(roomId).emit(
        "user-disconnected",
        peerId
      );

      io.to(roomId).emit(
        "participants-update",
        rooms[roomId].users
      );

      socket.leave(roomId);

      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
      }

    });

    // =====================================
    // CHAT
    // =====================================

    socket.on("send-message", (data) => {

      if (!rooms[data.roomId]) return;

      rooms[data.roomId].messages.push(data);

      io.to(data.roomId).emit(
        "receive-message",
        data
      );

    });

    socket.on("raise-hand", ({ roomId, peerId, raisedHand }) => {
      if (!rooms[roomId]) return;
      const user = rooms[roomId].users.find((u) => u.peerId === peerId);
      if (user) {
        user.raisedHand = raisedHand;
        io.to(roomId).emit("participants-update", rooms[roomId].users);
      }
    });

    // =====================================
    // TEAM CHAT
    // =====================================

    socket.on("join-team", ({ teamId }) => {
      socket.join(`team_${teamId}`);
      console.log(`Socket ${socket.id} joined team: team_${teamId}`);
    });

    socket.on("leave-team", ({ teamId }) => {
      socket.leave(`team_${teamId}`);
      console.log(`Socket ${socket.id} left team: team_${teamId}`);
    });

    socket.on("send-team-message", async ({ teamId, senderId, content }) => {
      try {
        const TeamMessage = require("../models/TeamMessage");
        
        const message = await TeamMessage.create({
          team: teamId,
          sender: senderId,
          content,
        });

        const populatedMessage = await TeamMessage.findById(message._id)
          .populate("sender", "name email role avatar");

        io.to(`team_${teamId}`).emit("receive-team-message", populatedMessage);
      } catch (err) {
        console.error("Error saving/sending team message:", err);
      }
    });

    // =====================================
    // HOST ACTIONS
    // =====================================

    socket.on("mute-participant", ({ roomId, targetPeerId, type }) => {
      io.to(roomId).emit("user-muted", { targetPeerId, type });
    });

    socket.on("kick-participant", ({ roomId, targetPeerId }) => {
      io.to(roomId).emit("user-kicked", { targetPeerId });
    });

    // =====================================
    // DISCONNECT
    // =====================================

    socket.on("disconnect", () => {

      Object.keys(rooms).forEach((roomId) => {

        if (!rooms[roomId]) return;

        const user = rooms[roomId].users.find(
          (u) => u.socketId === socket.id
        );

        if (!user) return;

        rooms[roomId].users =
          rooms[roomId].users.filter(
            (u) => u.socketId !== socket.id
          );

        socket.to(roomId).emit(
          "user-disconnected",
          user.peerId
        );

        io.to(roomId).emit(
          "participants-update",
          rooms[roomId].users
        );

        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId];
        }

      });

    });

  });
};