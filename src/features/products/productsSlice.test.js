import { describe, it, expect } from 'vitest';
import reducer, { fetchProducts } from './productsSlice';

describe('productsSlice', () => {
    it('passe en chargement quand la requête démarre', () => {
        const state = reducer(undefined, fetchProducts.pending('request'));
        expect(state.status).toBe('loading');
    });

    it('stocke les produits quand la requête réussit', () => {
        const products = [{ id: 1, name: 'Pain', price: 1.2 }];
        const state = reducer(undefined, fetchProducts.fulfilled(products, 'request'));
        expect(state.items).toEqual(products);
        expect(state.status).toBe('succeeded');
    });

    it('signale le rejet et conserve les produits déjà chargés', () => {
        const products = [{ id: 1, name: 'Pain', price: 1.2 }];
        const previous = reducer(undefined, fetchProducts.fulfilled(products, 'first'));
        const state = reducer(previous, fetchProducts.rejected(new Error('Connexion interrompue'), 'second'));
        expect(state).toEqual({ status: 'failed', items: products, error: 'Connexion interrompue' });
    });
});