import AsyncStorage from '@react-native-community/async-storage';
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useCart } from '../../hooks/cart';


// import { Container } from './styles';


const Dialog: React.FC = () => {
  const { removeItem } = useCart();

  const dialogCancelShop = useCallback(() => {
    Alert.alert(
      "GoMarketplace",
      "Você deseja cancelar a compra?",
      [
        {
          text: "Não",
          onPress: () => {},
        },
        { text: "Sim", onPress: () => (
          removeItem()
        )}
      ],
      { cancelable: false }
    );
  }, []);

  return (
    <TouchableOpacity style={{ marginRight: 12 }} onPress={dialogCancelShop}>
      <FeatherIcon name="x" size={24} />
    </TouchableOpacity>
  );
}

export default Dialog;
