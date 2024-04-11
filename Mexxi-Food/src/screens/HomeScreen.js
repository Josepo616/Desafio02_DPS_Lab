import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mexicanFood = [
  { id: 1, name: 'Tacos al Pastor', price: 10, type: 'food' },
  { id: 2, name: 'Enchiladas Verdes', price: 12, type: 'food' },
  { id: 3, name: 'Chiles Rellenos', price: 14, type: 'food' },
  { id: 4, name: 'Tostadas de Ceviche', price: 15, type: 'food' },
  { id: 5, name: 'Mole Poblano', price: 16, type: 'food' },
  { id: 6, name: 'Horchata', price: 5, type: 'drink' },
  { id: 7, name: 'Jarritos', price: 4, type: 'drink' },
  { id: 8, name: 'Agua de Jamaica', price: 3, type: 'drink' }
];

export default function HomeScreen({ navigation }) {
  const [order, setOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToOrder = (item) => {
    setOrder([...order, item]);
    setTotalPrice(prevTotalPrice => prevTotalPrice + item.price);
  };

  const placeOrder = async () => {
    setOrderPlaced(true);
    console.log("LOG Datos del pedido:", order); // Verifica los datos del pedido antes de navegar
    const existingOrders = await AsyncStorage.getItem('orders');
    const newOrder = { order: [...order], orderTime: new Date().toLocaleString() };
    if (existingOrders) {
      const parsedOrders = JSON.parse(existingOrders);
      parsedOrders.push(newOrder);
      await AsyncStorage.setItem('orders', JSON.stringify(parsedOrders));
    } else {
      await AsyncStorage.setItem('orders', JSON.stringify([newOrder]));
    }
    navigation.navigate('Details'); // Navega a la pantalla de detalles
    setOrder([]); // Reinicia el estado del pedido
    setTotalPrice(0); // Reinicia el estado del precio total
    setOrderPlaced(false); // Reinicia el estado de pedido realizado
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bannerTitle}>Bienvenido a Nuestro Restaurante Mexicano</Text>
        <Text style={styles.bannerText}>Selecciona los alimentos y bebidas que deseas ordenar:</Text>
      </View>

      <View style={styles.menu}>
        <Text style={styles.menuTitle}>Alimentos:</Text>
        {mexicanFood.map(item => {
          if (item.type === 'food') {
            return (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => addToOrder(item)}>
                <Text>{item.name} - ${item.price}</Text>
              </TouchableOpacity>
            );
          }
        })}
        <Text style={styles.menuTitle}>Bebidas:</Text>
        {mexicanFood.map(item => {
          if (item.type === 'drink') {
            return (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => addToOrder(item)}>
                <Text>{item.name} - ${item.price}</Text>
              </TouchableOpacity>
            );
          }
        })}
      </View>

      <View style={styles.orderSummary}>
        <Text style={styles.orderSummaryTitle}>Resumen de Orden:</Text>
        {order.map(item => (
          <View key={item.id} style={styles.orderItem}>
            <Text>{item.name} - ${item.price}</Text>
          </View>
        ))}
        <Text>Total: ${totalPrice}</Text>
        {order.length > 0 && (
          <TouchableOpacity style={styles.button} onPress={placeOrder}>
            <Text style={styles.buttonText}>Realizar Pedido</Text>
          </TouchableOpacity>
        )}
      </View>

      {orderPlaced && <Text style={styles.orderPlacedMessage}>Pedido Realizado</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20
  },
  header: {
    marginBottom: 20
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  bannerText: {
    fontSize: 16
  },
  menu: {
    marginBottom: 20
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  orderSummary: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20
  },
  orderSummaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  orderItem: {
    marginBottom: 10
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderPlacedMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginTop: 10
  }
});
