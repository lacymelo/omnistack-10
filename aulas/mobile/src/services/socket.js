import io from 'socket.io-client';

const socket = io('http://192.168.10.165:3333', {
    autoConnect: false,
});

//ouvi a criação de um novo dev
function subscribeToNewDevs(subscribeFunction) {
    socket.on('new-dev', subscribeFunction);
}

//para conectar
function connect(latitude, longitude, techs){
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    };
    socket.connect();
}

//para desconectar
function disconnect(){
    if(socket.connected){
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribeToNewDevs,
};