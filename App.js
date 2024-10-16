import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { PickerItem } from './src/Picker';
import { api } from './src/services/api';

export default function App() {
  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0);
  const [moedaBValor, setMoedaBValor] = useState(0);

  useEffect(() => {
    async function loadMoedas() {
      try {
        const response = await api.get('all');
        let arrayMoedas = [];
        Object.keys(response.data).map((key) => {
          arrayMoedas.push({
            key: key,
            label: key,
            value: key,
          });
        });
        console.log(arrayMoedas);
        setMoedas(arrayMoedas);
        setMoedaSelecionada(arrayMoedas[0].key);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar moedas:", error);
        setLoading(false); 
      }
    }

    loadMoedas();
  }, []);

  async function converta(){
    if(moedaBValor === 0 || moedaBValor === '' || moedaSelecionada === null){
      return;
    }
    const response = await api.get(`/all/${moedaSelecionada}-BRL`)
    let resultado =(response.data[moedaSelecionada].ask * parseFloat(moedaBValor))
    setValorConvertido(`${resultado.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}`);
    setValorMoeda(moedaBValor);
    Keyboard.dismiss();
  }


  if(loading){
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101215'}}>
        <ActivityIndicator color='#fff' size='large' />
      </View>
    )
  }

  return(
    <View style={styles.container}>
      <View style={styles.areaMoeda}>
        <Text style={styles.titulo}>Selecione sua moeda</Text>
        <PickerItem 
          moedas={moedas} 
          loading={loading} 
          moedaSelecionada={moedaSelecionada}
          onChange={ (moeda) => {
            setMoedaSelecionada(moeda)
          }}
        />
      </View>

      <View style={styles.areaValor}>
        <Text style={styles.titulo}> Digite um valor para converer em (R$) </Text>
        <TextInput
          placeholder="EX: 1.50"
          style={styles.input}
          keyboardType="numeric"
          value={moedaBValor}
          onChangeText={ (valor) => setMoedaBValor(valor) }
        />
      </View>

      <TouchableOpacity style={styles.btnArea} onPress={converta}>
        <Text style={styles.btnTXT}>CONVERTA</Text>
      </TouchableOpacity>

      {valorConvertido !== 0 &&(
        <View style={styles.areaResultado}>
          <Text style = {styles.valorConvertido}>{valorMoeda} {moedaSelecionada}</Text>
          <Text style = {{fontSize: 18, margin: 8}}> Corresponde a </Text>
          <Text style = {styles.valorConvertido}>{valorConvertido}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101215',
    paddingTop: 40,
    alignItems: 'center',
  },
  areaMoeda: {
    backgroundColor: '#f9f9f9',
    width: '90%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 1,
  },
  titulo: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    paddingLeft: 2,
    paddingTop: 5
  },
  areaValor: {
    backgroundColor: '#f9f9f9',
    width: '90%',
    paddingTop: 8,
    paddingBottom: 8,
  },
  input: {
    width: '100%',
    padding: 8,
    fontSize: 18,
    color: '#000',
  },
  btnArea: {
    width: '90%',
    backgroundColor: '#fb4b57' ,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius:8,
  },
  btnTXT: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
  areaResultado:{
    width: '90%',
    backgroundColor: '#fff',
    marginTop: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  valorConvertido:{
    fontSize: 28,
    color: '#000',
    fontWeight: 'bold'
  }
});
