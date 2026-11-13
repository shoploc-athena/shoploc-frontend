import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { auditAccessibility } from '../../test/auditAccessibility';
import StoreDetail from './StoreDetail';

const detailStates = [
    {
        label: 'loading',
        status: 'loading',
        store: null,
        error: null,
        role: 'status',
        message: 'Chargement de la fiche commerce…',
    },
    {
        label: 'empty',
        status: 'empty',
        store: null,
        error: null,
        role: null,
        message: 'Commerce introuvable',
    },
    {
        label: 'error',
        status: 'error',
        store: null,
        error: 'Service indisponible',
        role: 'alert',
        message: 'Service indisponible',
    },
];

describe('StoreDetail', () => {
    it.each(detailStates)('affiche l’état $label et ne présente aucune violation axe', async (state) => {
        const { container } = render(
            <main>
                <h1>Fiche commerce</h1>
                <StoreDetail {...state} onRetry={() => {}} onBack={() => {}} />
            </main>,
        );

        const stateElement = state.role
            ? screen.getByRole(state.role)
            : screen.getByRole('heading', { name: state.message });
        expect(stateElement.textContent).toContain(state.message);
        const results = await auditAccessibility(container);
        expect(results.violations).toEqual([]);
    });

    it('affiche les informations de la fiche sans violation axe', async () => {
        const { container } = render(
            <main>
                <h1>Fiche commerce</h1>
                <StoreDetail
                    status="success"
                    store={{
                        name: 'Maison Levain',
                        category: 'Boulangerie',
                        address: '12 rue Nationale',
                    }}
                    error={null}
                    onRetry={() => {}}
                    onBack={() => {}}
                />
            </main>,
        );

        expect(screen.getByRole('heading', { name: 'Maison Levain' })).toBeDefined();
        expect(screen.getByText('12 rue Nationale').tagName).toBe('ADDRESS');
        const results = await auditAccessibility(container);
        expect(results.violations).toEqual([]);
    });
});
