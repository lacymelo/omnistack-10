const { Router } = require('express');

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

//lista todos os usuários
routes.get('/devs', DevController.index);
//cadastra um novo usuário
routes.post('/devs', DevController.store);
// busca usuários
routes.get('/search', SearchController.index);
//update 
routes.put('/update', DevController.update);

//exportando as rotas
module.exports = routes;