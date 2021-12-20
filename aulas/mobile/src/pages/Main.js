import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import MapView, { Marker, Callout }  from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

export default function Main({ navigation }) {

    const [techs, setTechs] = useState('');
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]));
    }, [devs]);

    useEffect(() => {
        async function loadInitialLocation() {
            //retorna se o usuário deu permissão para usar a localização
           const { granted }  = await requestForegroundPermissionsAsync();

           if(granted){
               //acessa as coordenadas do usuário
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });
           }
        }

        loadInitialLocation();
    }, []);

    function setupWebSocket() {
        disconnect();

        const { latitude, longitude } = currentRegion;

        connect(
            latitude,
            longitude,
            techs
        );
    }

    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });

        setDevs(response.data);
        setupWebSocket();
    }

    //é chamado quando o usuário altera a área de localização
    function handleRegionChange(region) {
        setCurrentRegion(region);
    }

    if(!currentRegion){
        return null;
    }

    return(
        <>
            <KeyboardAvoidingView 
            behavior="padding" 
            enabled={Platform.io == 'ios'} 
            style={styles.map}>

                <MapView 
                onRegionChangeComplete={handleRegionChange} 
                initialRegion={currentRegion}
                style={styles.map}>

                    {devs.map(dev => (
                        <Marker 
                        key={dev._id}
                        coordinate={{longitude: dev.location.coordinates[0], latitude: dev.location.coordinates[1]}}>
                            <Image style={styles.avatar}  source={{ uri: dev.avatar_url }} />

                            <Callout onPress={() => {
                                //navegando e passando parâmetro na rota
                                navigation.push('Profile', { github_username: dev.github_username });
                            }}>
                                <View style={styles.callout}>
                                    <Text style={styles.devName}>{dev.name}</Text>
                                    <Text style={styles.devBio}>{dev.bio}</Text>
                                    <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}

                </MapView>

                <View style={styles.searchForm}>
                    <TextInput 
                    style={styles.searchInput}
                    placeholder='Buscar devs por techs...'
                    placeholderTextColor='#999'
                    //coloca a primeira letra de cada palavra em caixa alta
                    autoCapitalize='words'
                    //para não corrigir o texto digitado no input 
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                     />

                    {/* ao ser clicado perde levemente a opacidade */}
                    <TouchableOpacity onPress={loadDevs}
                    style={styles.loadButton}>
                        <MaterialIcons 
                            name='my-location'
                            size={20}
                            color='#FFF' />
                    </TouchableOpacity>
                    
                </View>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#FFF'
    },

    callout: {
        width: 260
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    devBio: {
        color: '#666',
        marginTop: 5,   
    },

    devTechs: {
        marginTop: 5,
    },

    searchForm: {
        position: 'absolute',
        // top: 20,
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,  
    },

    loadButton: {
       width: 50,
       height: 50,
       backgroundColor: '#8E4Dff',
       borderRadius: 25,
       justifyContent: 'center',
       alignItems: 'center',
       marginLeft: 15, 
    },
});