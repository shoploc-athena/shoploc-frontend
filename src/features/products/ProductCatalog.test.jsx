import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { auditAccessibility } from '../../test/auditAccessibility';
import ProductCatalog from './ProductCatalog';

const catalogStates = [
    {
        label: 'loading',
        status: 'loading',
        items: [],
        error: null,
        role: 'status',
        message: 'Chargement du catalogue…',
    },
    {
        label: 'empty',
        status: 'succeeded',
        items: [],
        error: null,
        role: 'status',
        message: 'Aucun produit disponible pour le moment.',
    },
    {
        label: 'error',
        status: 'failed',
        items: [],
        error: 'Service indisponible',
        role: 'alert',
        message: 'Erreur : Service indisponible',
    },
];

describe('ProductCatalog', () => {
    it.each(catalogStates)('affiche l’état $label et ne présente aucune violation axe', async (state) => {
        const { container } = render(
            <main>
                <h1>Catalogue</h1>
                <ProductCatalog {...state} />
            </main>,
        );

        expect(screen.getByRole(state.role).textContent).toContain(state.message);
        const results = await auditAccessibility(container);
        expect(results.violations).toEqual([]);
    });

    it('affiche les produits sans violation axe quand le catalogue est chargé', async () => {
        const { container } = render(
            <main>
                <h1>Catalogue</h1>
                <ProductCatalog
                    status="succeeded"
                    items={[{ id: 1, name: 'Pain au levain', price: 4.2 }]}
                    error={null}
                />
            </main>,
        );

        expect(screen.getByRole('list', { name: 'Produits du catalogue' }).textContent)
            .toContain('Pain au levain : 4.2 €');
        const results = await auditAccessibility(container);
        expect(results.violations).toEqual([]);
    });
});
