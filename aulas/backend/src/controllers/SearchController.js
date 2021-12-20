const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, res){
        const { latitude, longitude, techs } = req.query;
        //buscar todos os devs num raio de 10km
        //filtrar por tecnologias
        const techsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
               $in: techsArray,
            },

            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [ longitude, latitude ]
                    },
                    $maxDistance: 10000,
                }
            },
        });

        return res.json(devs);
    },

}