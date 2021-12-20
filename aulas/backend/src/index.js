const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//ouvir protocolos http e web socket
const { createServer } = require('http');
const { setupWebSocket } = require('./websocket');
const routes = require('./routes');


//criando a API
const  app = express();
// extrai o servidor http de dentro do express
const httpServer = createServer(app);
//passando o servidor
setupWebSocket(httpServer);

//conexão com o mongodb
mongoose.connect('mongodb+srv://dev10:dev10@cluster0.tbeyr.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//permite o acesso a API por outras aplicações
app.use(cors());

//para aceitar dados do tipo JSON
app.use(express.json());

//rotas da aplicação
app.use(routes);

//porta de acesso
httpServer.listen(3333);

