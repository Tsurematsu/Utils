/**
 * Clase que maneja los servidores ICE.
 */
export default class IceServers {
    #definedProperty = "iceServers";
    #urlsTurn = [];
    #iceServers = [
        {"urls": [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302"
        ]},
        {"urls": "stun:stun.ekiga.net"},
        {"urls": "stun:stun.ideasip.com"},
        {"urls": "stun:stun.stunprotocol.org:3478"},
        {"urls": "stun:stun.counterpath.net:3478"},
        {"urls": "stun:stun.freeswitch.org:3478"},
        {"urls": "stun:stun.voip.blackberry.com:3478"}
    ];

    /**
     * Constructor de la clase iceServers.
     * @param {string|string[]} turnServerHost - Host del servidor TURN o una lista de hosts.
     * @param {string} [accessProperty=null] - Propiedad de acceso para los servidores TURN.
     */
    constructor(turnServerHost=[], accessProperty=null) {
        if (accessProperty!==null) {this.#definedProperty = accessProperty;}
        if (turnServerHost === null) return;
        if (!Array.isArray(turnServerHost)) {turnServerHost = [turnServerHost];}
        this.#urlsTurn = turnServerHost;
    }

    /**
     * Carga los servidores TURN de las URLs proporcionadas.
     * @private
     * @async
     */
    async #loadTurnsServers(){
        if (typeof navigator === 'undefined') return;
        if (navigator.onLine) {
            for (const urlGetStun of this.#urlsTurn) {
                let turnServer = null; 
                try {
                    const resultFetch = await fetch(urlGetStun);
                    const response = resultFetch.ok ? await resultFetch.json() : null;
                    turnServer = response?.[this.#definedProperty];
                } catch (error) { 
                    console.log("Error in get stun server", error);
                }
                if (turnServer !== null) {
                    this.#iceServers.push(turnServer);
                }
            }
        } else {
            console.log("Offline mode, don't have Ethernet");
        }
    }

    /**
     * Obtiene la lista de servidores ICE.
     * @async
     * @returns {Promise<Object>} Promesa que resuelve a un objeto con la lista de servidores ICE.
     */
    async getIceServers(){
        await this.#loadTurnsServers();
        return { iceServers: this.#iceServers };
    }

    
    /**
     * Obtiene la lista de servidores ICE.
     * @async
     * @returns {Promise<Object[]>} Lista de servidores ICE.
     */
    async getIce(){
        if (this.#urlsTurn.length === 0) return this.#iceServers;
        await this.#loadTurnsServers();
        return this.#iceServers;
    }
}
