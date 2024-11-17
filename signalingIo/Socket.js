import "/socket.io/socket.io.js";
export default class Socket {
    name;
    room;
    #beacon;
    io=null;
    newClient;
    #tempReady=()=>{};
    constructor({name, room}){
        this.name = name;
        this.room = room;
        this.#makeBeacon();
        window.addEventListener('beforeunload', () => {
            navigator.sendBeacon(...this.#beacon)
        });
    }
    async connect(newClient){
        if (this.io) return;
        this.newClient = newClient;
        this.io = await io("/");
        this.#tempReady();
        this.io.on("newClient", async (identifier, data)=>{
            const to = (event, data) => {
                this.io.emit("to", {
                    addressee: identifier.sender, 
                    event
                }, data);
            };
            const retorno = await this.newClient(data, to);
            if (retorno) to(...retorno);
        });
        return await new Promise((resolve)=>{
            this.io.on("connect", ()=>{ 
                const onErrorTime = setTimeout(()=>{
                    resolve([null, false]);
                }, 9000);
                this.io.emit("join", { 
                    room:this.room,  
                    username:this.name
                });
                this.io.on("join", (data)=>{
                    this.#makeBeacon();
                    clearTimeout(onErrorTime);
                    resolve([data, true]);
                });
                this.io.on("alreadyUser", (data)=>{
                    this.#makeBeacon();
                    clearTimeout(onErrorTime);
                    resolve([data, false]);
                });
            });
        })
    }
    async renameUser(username){
        return await new Promise((resolve)=>{
            this.io.emit("onRename", username);
            this.io.on("onRename", (data)=>{
                resolve(data);
            });
        });
    }

    /**
     * Crea un beacon con la información del nombre y la sala.
     * @private
     */
    #makeBeacon() {
        const infoText = `${this.name}/${this.room}`;
        this.#beacon = [
            `/onDisconnect`,
            new Blob(
                [infoText], 
                { type: 'text/plain' }
            )
        ];
    }

    /**
     * Escucha un evento y ejecuta un callback cuando el evento ocurre.
     * @param {string} event - El nombre del evento a escuchar.
     * @param {function} callback - La función a ejecutar cuando el evento ocurre.
     */
    #tempEvent = [];
    async in(event, callback) {
        if (this.io === null) {
            this.#tempEvent.push([event, callback]);
            await new Promise((resolve)=>{this.#tempReady = resolve});
            while (this.#tempEvent.length) {
                const [event, callback] = this.#tempEvent.shift();
                this.in(event, callback);
            }
            return;
        }
        this.io.on(event, async (identifier, data) => {
            /**
             * Emite un evento a un destinatario específico.
             * @param {string} event - El nombre del evento a emitir.
             * @param {*} data - Los datos a enviar con el evento.
             */
            const to = (event, data) => {
                this.io.emit("to", {
                    addressee: identifier.sender, 
                    event
                }, data);
            };
            const retorno = await callback(data, to);
            if (retorno) {
                const [event, data] = retorno;
                to(event, data);
            }
        });
    }

    /**
     * Escucha un evento.
     * @param {...*} args - Los argumentos para el evento.
     */
    on(...args) {
        this.io.on(...args);
    }

    /**
     * Emite un evento.
     * @param {...*} args - Los argumentos para el evento.
     */
    emit(...args) {
        this.io.emit(...args);
    }
}