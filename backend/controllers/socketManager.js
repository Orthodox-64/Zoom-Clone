import { connections } from "mongoose";
const { Server } = require("socket.io");

let connections = {}; // Changed `connection` to `connections` for consistency
let message = {};
let timeOnline = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Someone Connected");

        socket.on("join-call", (path) => {
            if (!connections[path]) {
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            // Notify existing users
            connections[path].forEach((clientId) => {
                io.to(clientId).emit("user-joined", socket.id, connections[path]);
            });

            // Send previous messages
            if (message[path]) {
                message[path].forEach((msg) => {
                    io.to(socket.id).emit("chat-message", msg.data, msg.sender, msg["socket-id-sender"]);
                });
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections).find(([room, clients]) =>
                clients.includes(socket.id)
            ) || ["", false];

            if (found) {
                if (!message[matchingRoom]) {
                    message[matchingRoom] = [];
                }
                message[matchingRoom].push({ sender, data, "socket-id-sender": socket.id });
                console.log("message", matchingRoom, ";", sender, data);

                // Send message to everyone in the room
                connections[matchingRoom].forEach((clientId) => {
                    io.to(clientId).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        socket.on("disconnect", () => {
            const diffTime = Math.abs(timeOnline[socket.id] - new Date());
            delete timeOnline[socket.id];

            Object.entries(connections).forEach(([room, clients]) => {
                const index = clients.indexOf(socket.id);
                if (index !== -1) {
                    clients.splice(index, 1);
                    clients.forEach((clientId) => {
                        io.to(clientId).emit('user-left', socket.id);
                    });

                    // If room is empty, delete it
                    if (clients.length === 0) {
                        delete connections[room];
                    }
                }
            });
        });
    });

    return io; // Returning io to make it accessible outside the function
};