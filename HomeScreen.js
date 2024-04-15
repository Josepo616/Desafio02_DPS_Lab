import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mexicanFood = [
  { id: 1, name: 'Tacos al Pastor', price: 10, type: 'food', imageUrl: 'https://cdn7.kiwilimon.com/recetaimagen/13996/640x640/6330.jpg.webp' },
  { id: 2, name: 'Enchiladas Verdes', price: 12, type: 'food', imageUrl: 'https://cdn7.kiwilimon.com/recetaimagen/36938/50874.jpg' },
  { id: 3, name: 'Chiles Rellenos', price: 14, type: 'food', imageUrl: 'https://assets.unileversolutions.com/recipes-v2/243044.jpg' },
  { id: 4, name: 'Tostadas de Ceviche', price: 15, type: 'food', imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTOOPpCMiO4e74sV0tQP0Zj2KyU17b-D6KAlrYAWaraRLkMgLmXG5Vl8ROx1b01sPdKag3ydw6gOPNmfoCffM4GA184xdonpaoXwXpjApJwshZgrOw81qrMmD5ZunZIRBL2F5tAa5rv0A/s1600/DSC09151.JPG' },
  { id: 5, name: 'Mole Poblano', price: 16, type: 'food', imageUrl: 'https://cdn.recetasderechupete.com/wp-content/uploads/2023/03/Mole-poblano-con-arroz.jpg' },
  { id: 6, name: 'Torta de Res', price: 6, type: 'food', imageUrl: 'https://cocina-casera.com/mx/wp-content/uploads/2017/12/torta-2.jpg' },
  { id: 7, name: 'Horchata', price: 5, type: 'drink', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjWX492QHH9hbwDOQ9-rJQkvfMQJunHyyz2Smv7aGzyg&s' },
  { id: 8, name: 'Jarritos', price: 4, type: 'drink', imageUrl: 'https://www.despensamexicana.es/large/Jarritos-sabor-mandarina-i548.jpg' },
  { id: 9, name: 'Agua de Jamaica', price: 3, type: 'drink', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/A_glass_of_hibiscus_tea_01.jpg/1200px-A_glass_of_hibiscus_tea_01.jpg' },
  { id: 10, name: 'Champurrado', price: 3, type: 'drink', imageUrl: 'https://images.aws.nestle.recipes/resized/2020_05_26T17_43_26_mrs_ImageRecipes_143835lrg_1080_850.jpg' },
  { id: 11, name: 'Michelada', price: 8, type: 'drink', imageUrl: 'https://cdn.recetasderechupete.com/wp-content/uploads/2023/05/Michelada-mexicana-clasica.jpg' },
  { id: 12, name: 'Chamoyada de Tamarindo', price: 8, type: 'drink', imageUrl: 'https://cdn7.kiwilimon.com/recetaimagen/31855/36603.jpg' }
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

  // Función para dividir el array de ítems en filas de tres
  const chunkArray = (arr, chunkSize) => {
    return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, index) => {
      const start = index * chunkSize;
      return arr.slice(start, start + chunkSize);
    });
  };

  // Dividir los ítems en filas de tres
  const foodRows = chunkArray(mexicanFood.filter(item => item.type === 'food'), 3);
  const drinkRows = chunkArray(mexicanFood.filter(item => item.type === 'drink'), 3);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bannerTitle}>Bienvenido a Nuestro Restaurante Mexicano</Text>
        <Text style={styles.bannerText}>Selecciona los alimentos y bebidas que deseas ordenar:</Text>
      </View>

      <View style={styles.menu}>
        <Text style={styles.menuTitle}>Alimentos:</Text>
        {foodRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(item => (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => addToOrder(item)}>
                <View style={styles.card}>
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                  <Text style={styles.cardText}>{item.name} - ${item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <Text style={styles.menuTitle}>Bebidas:</Text>
        {drinkRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(item => (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => addToOrder(item)}>
                <View style={styles.card}>
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                  <Text style={styles.cardText}>{item.name} - ${item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
    padding: 20,
    backgroundColor: 'rgba(0, 128, 0, 1)', // Verde (Color del body)
  },
  header: {
    marginBottom: 20,
    backgroundColor: 'rgba(204, 0, 0, 1)', // Rojo (Color del header)
    padding: 10,
    borderRadius: 5,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Blanco
  },
  bannerText: {
    fontSize: 16,
    color: '#fff', // Blanco
  },
  menu: {
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuItem: {
    width: '30%',
  },
  card: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff', // Blanco
  },
  cardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  cardText: {
    textAlign: 'center',
    fontFamily: 'Arial',
    fontWeight: 'bold',
  },
  orderSummary: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
  },
  orderSummaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 1)', // Blanco (Color del botón)
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000', // Negro
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderPlacedMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
});
