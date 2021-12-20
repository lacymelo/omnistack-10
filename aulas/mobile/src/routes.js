import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Main from "./pages/Main";
import Profile from "./pages/Profile";

const Stack = createNativeStackNavigator();

export default function Routes(){
    return(
        <NavigationContainer>
            <Stack.Navigator 
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: '#7b40e7',
                    },
                    headerTintColor: '#FFF',
                    headerTitleAlign: 'center',
                  }}>
                <Stack.Screen name="Main" options={{ title: 'DevRadar' }} component={Main} />
                <Stack.Screen name="Profile" options={{ title: 'Perfil no Github' }} component={Profile} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}