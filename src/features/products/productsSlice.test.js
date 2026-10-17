import { describe, it, expect } from 'vitest';
import reducer, { fetchProducts } from './productsSlice';

describe('productsSlice', () => {
    it('passe en chargement quand la requête démarre', () => {
        const state = reducer(undefined, fetchProducts.pending());
        expect(state.status).toBe('loading');
    });

    it('stocke les produits quand la requête réussit', () => {
        const products = [{ id: 1, name: 'Pain', price: 1.2 }];
        const state = reducer(undefined, fetchProducts.fulfilled(products));
        expect(state.items).toEqual(products);
        expect(state.status).toBe('succeeded');
    });
});