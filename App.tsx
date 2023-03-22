import React, { useState, useRef, InputHTMLAttributes } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Touchable, Keyboard, Alert } from 'react-native'
import api from "./src/services/api";
import MaskInput, { Masks } from 'react-native-mask-input';

interface ICepUser {
  bairro: string
  cep: string
  complemento: string
  ddd: string
  gia: string
  ibge: string
  localidade: string
  logradouro: string
  siafi: string
  uf: string
}

const App = () => {
  const [cep, setCep] = useState('')
  const [cepUser, setCepUser] = useState<ICepUser | null>(null)
  const inputRef = useRef<TextInput>(null)

  async function handleSearch() {
    //if(cep === ''){
    //  Alert.alert('Opsss.', 'Digite um CEP válido')
    //  setCep('')
    // return;
    // }

    switch (true) {
      case cep.length === 0 || cep.length < 8:
        Alert.alert('Opsss.', 'Digite um CEP válido')
        setCep('')
        return;
    }

    try {
      const res = await api.get(`/${cep}/json`)
      setCepUser(res.data)
      Keyboard.dismiss()
    } catch (error) {
      console.log('ERROR: ', error)
    }

  }

  function handleClear() {
    setCep('')
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.text}>Digite o CEP desejado</Text>
        <MaskInput
          style={styles.input}
          value={cep}
          keyboardType='numeric'
          onChangeText={(_, unmasked) => {
            setCep(unmasked);
          }}
          placeholder="Ex: 16340000"
          ref={inputRef}
          //mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
          mask={Masks.ZIP_CODE}
        />
      </View>
      <View style={styles.viewAreaBtn}>
        <TouchableOpacity
          style={[styles.botao, { backgroundColor: '#1d75cd' }]}
          onPress={handleSearch}
        >
          <Text style={styles.botaoText}>
            Buscar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botao, { backgroundColor: '#cd3e1d' }]}
          onPress={handleClear}
        >
          <Text style={styles.botaoText}>
            Limpar
          </Text>
        </TouchableOpacity>
      </View>

      {
        cepUser !== null && (
          <View style={styles.resultado}>
            <Text style={styles.itemText}>CEP: {cepUser.cep}</Text>
            <Text style={styles.itemText}>Logradouro: {cepUser.logradouro}</Text>
            <Text style={styles.itemText}>Bairro: {cepUser.bairro}</Text>
            <Text style={styles.itemText}>Cidade: {cepUser.localidade}</Text>
            <Text style={styles.itemText}>Estado: {cepUser.uf}</Text>
          </View>
        )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000000'
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    width: '90%',
    padding: 10,
    fontSize: 18
  },
  viewAreaBtn: {
    alignItems: "center",
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-around'
  },
  botao: {
    justifyContent: 'center',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  botaoText: {
    fontSize: 18,
    color: '#FFF'
  },
  resultado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontSize: 22
  }
})

export default App