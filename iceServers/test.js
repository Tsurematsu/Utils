import iceServers from "./iceServers.js";
test();
async function test() {
    const iceServersInstance = new iceServers();
    const iceServersList = await iceServersInstance.getIceServers();
    const iceServersList1 = await iceServersInstance.getIce();
    console.log(iceServersList);
    console.log(iceServersList1);
}