import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useFocusEffect } from '@react-navigation/native';


const DetailsScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrderData = async () => {
    console.log("Loading order data...");
    const savedOrders = await AsyncStorage.getItem('orders');
    console.log("Saved orders:", savedOrders);
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      setOrders(parsedOrders);
    }
    setIsLoading(false);
  };

  // Cargar datos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      loadOrderData();
    }, [])
  );

  const handleNewOrder = () => {
    navigation.navigate('Home');
  };

  const handleDeleteOrder = async (orderToDelete) => {
    try {
      const updatedOrders = orders.filter(order => order !== orderToDelete);
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      Alert.alert('Orden Eliminada', 'La orden ha sido eliminada del historial correctamente.');
      console.log("Orden eliminada:", orderToDelete);
    } catch (error) {
      console.error('Error al borrar la orden:', error);
    }
  };
  
  // Función para calcular el total de la orden
  const calculateTotal = (order) => {
    let total = 0;
    order.forEach(item => {
      total += item.price;
    });
    return total;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Pedido</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderTime}>Hora del Pedido: {item.orderTime}</Text>
              <FlatList
                data={item.order}
                renderItem={({ item }) => (
                  <View style={styles.subOrderItem}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>Precio: ${item.price}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
              <Text style={styles.total}>Total: ${calculateTotal(item.order)}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteOrder(item)}>
                <Text style={styles.deleteButtonText}>Eliminar Orden</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
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
    textAlign: 'center',
  },
  orderItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  orderTime: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subOrderItem: {
    marginBottom: 10,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;
