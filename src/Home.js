import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const route = useRoute();
  const url = 'http://10.0.2.2:3000/products';

  const navigation = useNavigation();

  useEffect(() => {
    loadProducts();
  }, [route.params?.res]);

  const loadProducts = () => {
    Axios.get(url)
      .then(res => {
        setProducts(res.data);
      })
      .catch(erro => Alert.alert('Erro', 'Erro ao requisitar produtos' + erro));
  };

  const irParaCadastro = (event, product) => {
    event.persist();

    if (product != null) {
      navigation.navigate('Cadastro', {product});
    } else {
      navigation.navigate('Cadastro');
    }
  };

  const deleteProduct = (id, title) => {
    Alert.alert(
      'Exclusão',
      `Tem certeza sobre a exclusão de ${title}?`,
      [
        {
          text: 'Não',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            Axios.delete(url + '/' + id)
              .then(() => {
                Alert.alert('Exclusão', 'Produto excluido com sucesso');
                loadProducts();
              })
              .catch(erro =>
                Alert.alert('Erro', 'Erro ao excluir produto: ' + erro),
              );
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.headerText}>Estoque</Text>
        <TouchableOpacity onPress={event => irParaCadastro(event)}>
          <Text style={styles.buttonText}>Ir para Cadastro</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.flatList}
        keyExtractor={(item, index) => item.id.toString()}
        data={products}
        renderItem={({item}) => (
          <View style={styles.itemFlatList}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Descrição', item.descricao);
              }}>
              <Image
                source={{uri: item.img ? item.img : null}}
                style={styles.image}
              />
            </TouchableOpacity>
            <View style={styles.itemDescription}>
              <Text numberOfLines={1} adjustsFontSizeToFit>
                Produto: {item.titulo}
              </Text>
              <Text numberOfLines={1} adjustsFontSizeToFit>
                Preço: {item.preco}
              </Text>
              <Text numberOfLines={1} adjustsFontSizeToFit>
                Modelo: {item.modelo}
              </Text>
              <Text numberOfLines={1} adjustsFontSizeToFit>
                Categoria: {item.categoria}
              </Text>
              <Text numberOfLines={1} adjustsFontSizeToFit>
                Quantidade: {item.quantidade}
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={() => deleteProduct(item.id, item.titulo)}>
                <Icon
                  size={23}
                  name="trash"
                  style={styles.btnIcon}
                  color="red"></Icon>
              </TouchableOpacity>
              <TouchableOpacity onPress={event => irParaCadastro(event, item)}>
                <Icon
                  size={23}
                  name="pen"
                  style={styles.btnIcon}
                  color="blue"></Icon>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={<View style={styles.footer} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonText: {
    fontSize: 15,
    color: 'blue',
  },
  flatList: {
    flex: 1,
  },
  itemFlatList: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    resizeMode: 'contain',
  },
  itemDescription: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    height: 20, // Altura do espaçamento adicional no final da lista
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  btnIcon: {
    margin: 10,
  },
});

export default Home;
