import React, { useState, useEffect } from "react";

export default function DevForm({ onSubmit }){

    const [github_username, setUsername] = useState('');
    const [techs, setTechs] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
    
            setLatitude(latitude);
            setLongitude(longitude); 
          },
          (err) => {
    
          },
          {
            timeout: 30000
          }
        );
    }, []);

    async function handleSubmit(e){
        e.preventDefault();
        await onSubmit({
            github_username,
            techs,
            latitude,
            longitude,
        });

        setUsername('');
        setTechs('');
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className="input-block">
            <label htmlFor="github_username">Usuário do Github</label>
            <input type="text"
            name="github_username"
            onChange={e => setUsername(e.target.value)}
            value={github_username}
            id="username_github" required/>
            </div>

            <div className="input-block">
            <label htmlFor="techs">Tecnologias (separadas por vírgula)</label>
            <input 
            type="text"
            name="techs"
            id="techs"
            onChange={e => setTechs(e.target.value)}
            value={techs}
            required/>
            </div>

            <div className="input-group">
            <div className="input-block">
                <label htmlFor="latitude">Latitude</label>
                <input
                type="number"
                name="latitude"
                id="latitude"
                onChange={e => setLatitude(e.target.value)}
                value={latitude}
                required/>
            </div>

            <div className="input-block">
                <label htmlFor="longitude">Longitude</label>
                <input
                type="number"
                name="longitude" id="longitude"
                onChange={e => setLongitude(e.target.value)}
                value={longitude}
                required/>
            </div>
            </div>

            <button type="submit">Salvar</button>
        </form>
    );
}