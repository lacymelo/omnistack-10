const { Server} = require('socket.io');
const calculateDistance = require('./utils/calculateDistance');
const parseStringAsArray = require('./utils/parseStringAsArray');

let io;

const connections = [];

exports.setupWebSocket = (server) => {
    io = new Server(server);

    //ouvindo o evento de conexão, toda vez que um usuário se conectar na aplicação via websocket 
    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query;

        //salvado as conexões dentro da aplicação
        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        })
    });
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        /**
         * coordinates -> coordenadas do novo dev criado
         * connection.coordinates -> cada uma das coordenadas armazenadas no websocket
         * 10 -> distância em Km
         */
        return calculateDistance(coordinates, connection.coordinates) < 10
        && connection.techs.some(item => techs.includes(item));
    });
}

/**
 * enviar mensagem para o mobile
 * @param {*} to -> usuários destinatários
 * @param {*} message -> mensagem
 * @param {*} data -> dados do novo dev criado
 */
exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    });
}