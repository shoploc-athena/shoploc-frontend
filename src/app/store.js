import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';

// Le store regroupe toutes les données partagées de l'application
export const store = configureStore({
    reducer: {
        products: productsReducer,
    },
});