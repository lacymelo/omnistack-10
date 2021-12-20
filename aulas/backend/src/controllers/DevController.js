const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {

    async index(req, res){
        const dev = await Dev.find();

        return res.json(dev);
    },

    async store(req, res){
        //recuperando os dados enviados pelo usuário por post
        let { github_username, techs, latitude, longitude} = req.body;

        techs = parseStringAsArray(techs);

        //verifica se o usuário existe na base de dados
        let dev = await Dev.findOne({github_username});

        if(!dev){
            //recuperando os dados do usuário da API do GitHub
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
        
            let { name, avatar_url, bio } = response.data;
        
            if(!name){
                name = response.data.login;
            }
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        
            //cria a nova informação no banco
            dev = await Dev.create({
                name,
                github_username,
                bio,
                avatar_url,
                techs,
                location,
            });

            /**
             * filtrar as conexões que estão no máximo 10km de distância
             * e que o deve tenha pelo menos uma das tecnologias filtradas
             */

            const sendSocketMessageTo = findConnections(
                {latitude, longitude},
                techs,
            );

            //mensagem de aviso para a criação de novo dev
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
    
        return res.json(dev);
    },

    async update(req, res){

        const { name } = req.body;

        const { dev_id } = req.headers;

        let dev = await Dev.findById(dev_id);

        dev.name = name;

        dev.save();

        return res.json(dev);
    }

}