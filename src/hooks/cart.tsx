import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { ToastAndroid } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
  removeItem(): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const storagedProducts = await AsyncStorage.getItem('@GoMarketplace:products');

      if (storagedProducts) {
        setProducts([...JSON.parse(storagedProducts)]);
      }

    }

    loadProducts();
  }, [setProducts]);

  const addToCart = useCallback(async product => {
    // TODO ADD A NEW ITEM TO THE CART
    const productExists = products.find(p => p.id === product.id);

    if (productExists) {
      setProducts(
        products.map(p => p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p
        ),
      );
    } else {
      setProducts([...products, { ...product, quantity: 1 }]);
    }

    await AsyncStorage.setItem(
      '@GoMarketplace:products',
      JSON.stringify(products),
    );
  }, [products]);

  const removeItem = useCallback(async () => {

    const res = await AsyncStorage.getItem('@GoMarketplace:products');

    res === null ? ToastAndroid.show("Você não possui itens no carrinho!", ToastAndroid.SHORT)
    : (await AsyncStorage.removeItem('@GoMarketplace:products'), setProducts([]));

    // if (res == null) {
    //   ToastAndroid.show("Você não possui itens no carrinho!", ToastAndroid.SHORT);
    // } else {
    //   await AsyncStorage.removeItem('@GoMarketplace:products');
    //   setProducts([]);
    // }

  }, []);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
    const newProducts = products.map(
      product => product.id === id
        ? { ...product, quantity: product.quantity + 1 }
        : product,

    );

    setProducts(newProducts);

    await AsyncStorage.setItem(
      '@GoMarketplace:products',
      JSON.stringify(newProducts),
    );

  }, [products]);

  const decrement = useCallback(async id => {
    // // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
    // const newProducts = products.map(
    //   product => product.id === id
    //     ? { ...product, quantity: product.quantity - 1 }
    //     : product,
    // );

    // setProducts(newProducts);
    const productsExist = products.find(prod => prod.id === id);
    if (productsExist) {
      if (productsExist.quantity > 1) {
        productsExist.quantity -= 1;
      } else {
        const repositoryIndex = products.findIndex(prod => prod.id === id);
        products.splice(repositoryIndex, 1);
      }
    }
    setProducts([...products]);

    await AsyncStorage.setItem(
      '@GoMarketplace:products',
      JSON.stringify(products),
    );

  }, [products]);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products, removeItem }),
    [products, addToCart, increment, decrement, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
