import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Action asynchrone : appelle l'API du catalogue
export const fetchProducts = createAsyncThunk('products/fetch', async () => {
    const response = await fetch('/api/products');
    if (!response.ok) {
        throw new Error('Impossible de charger les produits');
    }
    return response.json();
});

const initialState = { items: [], status: 'idle', error: null };

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    // Réagit aux 3 états de la requête : en cours, réussie, échouée
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default productsSlice.reducer;