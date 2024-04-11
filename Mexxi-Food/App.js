import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native';
import LoginScreen from './src/screens/login';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Lógica de inicio de sesión. Por ejemplo, verificar credenciales.
    // Aquí puedes configurar la lógica para cambiar el estado loggedIn a true si las credenciales son correctas.
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Lógica de cierre de sesión. Por ejemplo, limpiar el estado de la aplicación.
    // Aquí puedes configurar la lógica para cambiar el estado loggedIn a false.
    setLoggedIn(false);
  };

  return (
    <NavigationContainer>
      {loggedIn ? (
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Details" component={DetailsScreen} />
        </Drawer.Navigator>
      ) : (
        <LoginScreen onLogin={handleLogin} /> // Pasar la función onLogin como prop
      )}
      {loggedIn && (
        <Button title="Cerrar Sesión" onPress={handleLogout} />
      )}
    </NavigationContainer>
  );
}
