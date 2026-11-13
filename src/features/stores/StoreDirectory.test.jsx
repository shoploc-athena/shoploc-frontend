import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { auditAccessibility } from '../../test/auditAccessibility';
import StoreDirectory from './StoreDirectory';

const directoryStates = [
    {
        label: 'loading',
        status: 'loading',
        stores: [],
        error: null,
        role: 'status',
        message: 'Chargement des commerces…',
    },
    {
        label: 'empty',
        status: 'empty',
        stores: [],
        error: null,
        role: 'status',
        message: 'Aucun commerce disponible pour le moment.',
    },
    {
        label: 'error',
        status: 'error',
        stores: [],
        error: 'Service indisponible',
        role: 'alert',
        message: 'Impossible de charger les commerces : Service indisponible',
    },
];

describe('StoreDirectory', () => {
    it.each(directoryStates)('affiche l’état $label et ne présente aucune violation axe', async (state) => {
        const { container } = render(
            <main>
                <h1>Commerces</h1>
                <StoreDirectory {...state} onRetry={() => {}} onSelect={() => {}} />
            </main>,
        );

        expect(screen.getByRole(state.role).textContent).toContain(state.message);
        const results = await auditAccessibility(container);
        expect(results.violations).toEqual([]);
    });

    it('permet d’ouvrir la fiche et ne présente aucune violation axe', async () => {
        const onSelect = vi.fn();
        const store = {
            id: 'boulangerie',
            name: 'Maison Levain',
            category: 'Boulangerie',
            address: '12 rue Nationale',
        };
        const { container } = render(
            <main>
                <h1>ShopLoc</h1>
                <section>
                    <h2>Commerces</h2>
                    <StoreDirectory
                        stores={[store]}
                        status="success"
                        error={null}
                        onRetry={() => {}}
                        onSelect={onSelect}
                    />
                </section>
            </main>,
        );

        const results = await auditAccessibility(container);
        expect(results.violations).toEqual([]);
        screen.getByRole('button', { name: 'Voir la fiche de Maison Levain' }).click();

        expect(onSelect).toHaveBeenCalledWith(store);
    });
});
