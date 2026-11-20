import { expect, it } from 'vitest';
import { store } from './store';
import { fetchProducts } from '../features/products/productsSlice';

it('publie les transitions du catalogue aux abonnés du store de l’application', () => {
    const observed = [];
    const unsubscribe = store.subscribe(() => observed.push(store.getState().products));
    const products = [{ id: 1, name: 'Pain', price: 1.2 }];

    try {
        expect(store.getState().products.status).toBe('idle');
        store.dispatch(fetchProducts.pending('request'));
        store.dispatch(fetchProducts.fulfilled(products, 'request'));
    } finally {
        unsubscribe();
    }

    expect(observed.map(({ status }) => status)).toEqual(['loading', 'succeeded']);
    expect(observed[1].items).toEqual(products);
});
