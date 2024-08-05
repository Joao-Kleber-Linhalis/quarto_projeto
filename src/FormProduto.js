import {useNavigation, useRoute} from '@react-navigation/native';
import Axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

const FormProduto = () => {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [modelo, setModelo] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [preco, setPreco] = useState(0.0);
  const [descricao, setDescricao] = useState('');
  const [img, setImg] = useState(null);
  const [id, setId] = useState('');
  const [isAtt, setAtt] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const url = 'http://10.0.2.2:3000/products';

  useEffect(() => {
    if (route.params?.product != null) {
      navigation.setOptions({title: 'Atualizar'});
      const product = route.params?.product;
      setId(product.id);
      setTitulo(product.titulo);
      setCategoria(product.categoria);
      setModelo(product.modelo);
      setQuantidade(product.quantidade);
      setPreco(product.preco);
      setDescricao(product.descricao);
      setImg(product.img);
      setAtt(true);
    }
  }, [route.params?.product]);

  const getPhoto = () => {
    ImagePicker.launchImageLibrary(
      {
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: true,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          const source = {uri: response.assets[0].uri};
          setImg(source.uri);
        }
      },
    );
  };

  const saveProduct = () => {
    if (validator()) {
      Axios.post(url, {
        titulo,
        categoria,
        modelo,
        quantidade,
        preco,
        descricao,
        img,
      })
        .then(res => {
          Alert.alert('Salvo com sucesso');
          navigation.navigate('Home', {res});
        })
        .catch(() => Alert.alert('Erro ao Salvar!'));
    } else {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
    }
  };

  const attProduct = () => {
    if (validator()) {
      Axios.patch(url + '/' + id, {
        titulo,
        categoria,
        modelo,
        quantidade,
        preco,
        descricao,
        img,
      })
        .then(res => {
          Alert.alert('Atualizado com sucesso');
          navigation.navigate('Home', {res});
        })
        .catch(() => Alert.alert('Erro ao Salvar!'));
    } else {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
    }
  };

  const validator = () => {
    return (
      titulo.trim() !== '' &&
      categoria.trim() !== '' &&
      modelo.trim() !== '' &&
      quantidade !== 0 &&
      preco !== 0.0 &&
      descricao.trim() !== '' &&
      img !== null
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={{alignItems: 'center', flex: 1}}>
        <View style={styles.imageContainer}>
          {img ? (
            <Image source={{uri: img}} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Sem imagem</Text>
          )}
        </View>
        <TouchableOpacity onPress={getPhoto}>
          <Text>Carregar Imagem</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={titulo}
        style={styles.textInput}
        placeholder="Titulo"
        onChangeText={txt => setTitulo(txt)}
        placeholderTextColor="#5a5a5a"></TextInput>
      <TextInput
        value={descricao}
        style={styles.textInput}
        placeholder="Descricao"
        onChangeText={txt => setDescricao(txt)}
        placeholderTextColor="#5a5a5a"></TextInput>
      <TextInput
        value={preco.toString()}
        style={styles.textInput}
        placeholder="Preço"
        onChangeText={txt => setPreco(parseFloat(txt))}
        placeholderTextColor="#5a5a5a"
        keyboardType="decimal-pad"></TextInput>
      <TextInput
        value={quantidade.toString()}
        style={styles.textInput}
        placeholder="Quantidade"
        onChangeText={txt => setQuantidade(parseInt(txt))}
        placeholderTextColor="#5a5a5a"
        keyboardType="numeric"></TextInput>
      <TextInput
        value={categoria}
        style={styles.textInput}
        placeholder="Categoria"
        onChangeText={txt => setCategoria(txt)}
        placeholderTextColor="#5a5a5a"></TextInput>

      <TextInput
        value={modelo}
        style={styles.textInput}
        placeholder="Modelo"
        onChangeText={txt => setModelo(txt)}
        placeholderTextColor="#5a5a5a"></TextInput>

      {isAtt ? (
        <TouchableOpacity onPress={attProduct} style={styles.button}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={saveProduct} style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '90%',
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // cor de fundo padrão
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    textAlign: 'center',
    color: '#5a5a5a',
  },
  textInput: {
    fontSize: 16,
    marginTop: 10,
    borderWidth: 1,
    width: '100%',
    height: 40,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FormProduto;
