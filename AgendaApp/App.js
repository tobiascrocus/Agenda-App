import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Inicio from './screens/Inicio';
import Tareas from './screens/Tareas';
import Categorias from './screens/Categorias';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Tareas" component={Tareas} />
        <Stack.Screen name="Categorias" component={Categorias} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}