import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Button, StyleSheet, View } from 'react-native'; // Importar StyleSheet y View

import LoginScreen from './src/screens/login';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {loggedIn ? (
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Details" component={DetailsScreen} />
          </Drawer.Navigator>
        ) : (
          <LoginScreen onLogin={handleLogin} />
        )}
        {loggedIn && (
          <View style={styles.logoutButtonContainer}>
            <Button title="Cerrar Sesión" onPress={handleLogout} />
          </View>
        )}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});
