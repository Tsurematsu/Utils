import { Server } from 'socket.io';
import express from 'express';

/**
 * Clase para manejar la señalización de WebSockets usando Socket.IO.
 * Esta clase debe ser utilizada solo del lado del servidor.
 * 
 * @class SignalingIo
 */
export default class SignalingIo {
    io = null;
    cors = {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }

    /**
     * Obtiene las salas a las que está conectado un socket, excluyendo la sala principal.
     * 
     * @param {Socket} socket - El socket del cliente.
     * @returns {Array} - Lista de salas a las que está conectado el socket.
     */
    #roomsClient(socket) {
        return Array.from(socket.rooms).filter(room =>
            room !== Array.from(socket.rooms)[0]
        );
    }

    /**
     * Crea una instancia de SignalingIo.
     * 
     * @param {http.Server} serverHttp - El servidor HTTP.
     */
    constructor(serverHttp) {
        this.io = new Server(serverHttp, { cors: this.cors });
        this.io.on("connection", (socket) => {
            /**
             * Evento para unirse a una sala.
             * 
             * @event join
             * @param {Object} data - Datos del evento.
             * @param {string} data.room - Nombre de la sala.
             * @param {string} data.username - Nombre de usuario.
             */
            socket.on("join", async ({ room, username }) => {
                if (this.#roomsClient(socket).includes(room)) {
                    socket.emit("errorJoin", { data: "Ya estas en una sala" });
                    return;
                }
                let userAlreadyExist = false;
                const usersSocket = await this.io.fetchSockets();
                const users = usersSocket
                    .filter(localSocket => (localSocket.username !== undefined))
                    .map((localSocket) => {
                        if (localSocket.username === username) {
                            userAlreadyExist = true;
                        }
                        return localSocket.username;
                    });
                if (userAlreadyExist) {
                    socket.emit("alreadyUser", {
                        data: "El usuario ya existe",
                        status: "user_exist"
                    });
                    return;
                }
                socket.username = username;
                socket.join(room);
                socket.emit("join", { users });
                socket.broadcast.to(room).emit("newClient", {
                    sender: String(socket.username),
                    addressee: "all"
                }, { type: "newClient" });
            });

            //rename user
            socket.on("onRename", async (username) => {
                socket.username = username;
                socket.join(room);
                let userAlreadyExist = false;
                const usersSocket = await this.io.fetchSockets();
                usersSocket
                    .filter(localSocket => (localSocket.username !== undefined))
                    .map((localSocket) => {
                        if (localSocket.username === username) {
                            userAlreadyExist = true;
                        }
                        return localSocket.username;
                    });
                if (userAlreadyExist) {
                    socket.emit("alreadyUser", {
                        data: "El usuario ya existe",
                        status: "user_exist"
                    });
                    return;
                }
                socket.emit("onRename", { username });
            });

            /**
             * Evento para enviar un mensaje a un destinatario específico.
             * 
             * @event to
             * @param {Object} data - Datos del evento.
             * @param {string} data.addressee - Nombre del destinatario.
             * @param {string} data.event - Nombre del evento.
             * @param {Object} data - Datos adicionales del evento.
             */
            socket.on('to', async ({ addressee, event }, data) => {
                const sockets = await this.io.fetchSockets();
                const socketEncontrado = sockets.find(
                    toClientSocket => toClientSocket.username === addressee
                );
                if (socketEncontrado) {
                    socketEncontrado.emit(
                        event,
                        {
                            sender: String(socket.username),
                            addressee
                        },
                        data
                    );
                    return;
                }
                console.log("Socket no encontrado");
            });
        });
    }

    /**
     * Ruta para manejar la desconexión de un usuario.
     * 
     * @name onDisconnect
     * @route {POST} /onDisconnect
     * @param {express.Request} req - La solicitud HTTP.
     * @param {express.Response} res - La respuesta HTTP.
     */
    onDisconnect = express.Router().post("/onDisconnect", async (req, res) => {
        const [user, room] = req.body.toString('utf-8').split('/');
        this.io.to(room).emit('onDisconnect', user);
        res.sendStatus(204); // No Content
    });
}