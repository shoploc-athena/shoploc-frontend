import { afterEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../../App';
import { auditAccessibility } from '../../test/auditAccessibility';
import productsReducer from './productsSlice';

function renderCatalogue() {
    const store = configureStore({
        reducer: { products: productsReducer },
    });

    return render(
        <Provider store={store}>
            <App />
        </Provider>,
    );
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('catalogue connecté à l’API', () => {
    it('annonce le chargement jusqu’à la réponse du serveur', async () => {
        let completeRequest;
        vi.stubGlobal('fetch', vi.fn(() => new Promise((resolve) => {
            completeRequest = resolve;
        })));
        const { container } = renderCatalogue();

        expect(screen.getByRole('status').textContent).toContain('Chargement du catalogue');
        expect(fetch).toHaveBeenCalledWith('/api/products');
        expect((await auditAccessibility(container)).violations).toEqual([]);

        await act(async () => {
            completeRequest({ ok: true, json: async () => [] });
        });

        expect(screen.getByRole('status').textContent).toContain('Aucun produit disponible');
    });

    it('affiche une liste vide après une réponse vide de l’API', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [],
        }));
        const { container } = renderCatalogue();

        await screen.findByText('Aucun produit disponible pour le moment.');

        expect(screen.queryByRole('list')).toBeNull();
        expect((await auditAccessibility(container)).violations).toEqual([]);
    });

    it.each([
        {
            label: 'erreur HTTP',
            response: () => Promise.resolve({ ok: false }),
            message: 'Erreur : Impossible de charger les produits',
        },
        {
            label: 'erreur réseau',
            response: () => Promise.reject(new Error('Connexion interrompue')),
            message: 'Erreur : Connexion interrompue',
        },
    ])('annonce une $label sans laisser le chargement affiché', async ({ response, message }) => {
        vi.stubGlobal('fetch', vi.fn(response));
        const { container } = renderCatalogue();

        expect((await screen.findByRole('alert')).textContent).toBe(message);
        expect(screen.queryByRole('status')).toBeNull();
        expect((await auditAccessibility(container)).violations).toEqual([]);
    });

    it('affiche les produits renvoyés par l’API sans violation axe', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [{ id: 1, name: 'Pain au levain', price: 4.2 }],
        }));
        const { container } = renderCatalogue();

        const products = await screen.findByRole('list', { name: 'Produits du catalogue' });

        expect(products.textContent).toContain('Pain au levain : 4.2 €');
        expect(screen.queryByRole('status')).toBeNull();
        expect((await auditAccessibility(container)).violations).toEqual([]);
    });
});
