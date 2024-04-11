import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = ({ route, navigation }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrderData = async () => {
      console.log("Loading order data...");
      const savedOrders = await AsyncStorage.getItem('orders');
      console.log("Saved orders:", savedOrders);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      setIsLoading(false); // Una vez cargados los datos, establecer isLoading en false
      console.log("isLoading:", isLoading); // Verificar si isLoading cambia a false
    };
    loadOrderData();
  }, []);

  const handleNewOrder = () => {
    navigation.navigate('Home'); // Redirige al usuario de vuelta a la pantalla de inicio
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Pedido</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <FlatList
            data={orders}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Text>Hora del Pedido: {item.orderTime}</Text>
                <FlatList
                  data={item.order}
                  renderItem={({ item }) => (
                    <View style={styles.subOrderItem}>
                      <Text>{item.name} - ${item.price}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleNewOrder}>
        <Text style={styles.buttonText}>Realizar otro Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderItem: {
    marginBottom: 20,
  },
  subOrderItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;