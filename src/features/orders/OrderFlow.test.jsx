import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OrderFlow from './OrderFlow';

function click(name) {
    fireEvent.click(screen.getByRole('button', { name }));
}

function preview(value) {
    fireEvent.change(screen.getByRole('combobox', { name: 'Écran à prévisualiser' }), {
        target: { value },
    });
}

function selectSlots() {
    fireEvent.change(screen.getByRole('combobox', { name: /créneau de retrait chez Maison Levain/i }), {
        target: { value: 'Aujourd’hui, 16 h – 17 h' },
    });
    fireEvent.change(screen.getByRole('combobox', { name: /créneau de retrait chez Les Jardins de Léa/i }), {
        target: { value: 'Demain, 10 h – 11 h' },
    });
}

describe('prototype de commande', () => {
    it('recalcule le panier et retire un article lorsque sa quantité atteint zéro', () => {
        render(<OrderFlow />);
        const summary = within(screen.getByRole('complementary', { name: 'Votre commande' }));
        const total = (amount) => expect(summary.getByText('Total estimé').parentElement.textContent).toMatch(amount);

        total(/14,90\s*€/);
        click('Ajouter un Pain au levain');
        total(/19,10\s*€/);
        click('Retirer un Pain au levain');
        click('Retirer un Pain au levain');
        expect(screen.queryByRole('group', { name: 'Quantité de Pain au levain' })).toBeNull();
        total(/10,70\s*€/);
    });

    it('exige un créneau par commerce avant de simuler le paiement et conserve les créneaux choisis', () => {
        render(<OrderFlow />);
        click('Continuer');
        const pay = screen.getByRole('button', { name: 'Simuler l’attente Stripe' });
        expect(pay.disabled).toBe(true);

        const firstSlot = screen.getByRole('combobox', { name: /créneau de retrait chez Maison Levain/i });
        fireEvent.change(firstSlot, { target: { value: 'Aujourd’hui, 16 h – 17 h' } });
        expect(pay.disabled).toBe(true);
        selectSlots();
        expect(pay.disabled).toBe(false);
        fireEvent.click(pay);

        expect(within(screen.getByRole('status')).getByRole('heading', { name: 'Confirmation en cours' })).toBeDefined();
        click('Simuler la confirmation de paiement');
        expect(screen.getAllByText('742 816')).toHaveLength(2);
        expect(screen.getByText('Demain, 10 h – 11 h')).toBeDefined();

        click('Suivre mes commandes');
        click(/SL-2051/);
        expect(screen.getByRole('heading', { name: 'Commande SL-2051' })).toBeDefined();
        expect(screen.getByText('Étape actuelle').closest('li').textContent).toContain('Confirmée');
        fireEvent.change(screen.getByLabelText('Statut de la commande'), { target: { value: 'ANNULEE' } });
        expect(screen.getByText(/Remboursement dû : 14,90\s*€/)).toBeDefined();
        expect(screen.queryByRole('button', { name: 'Demander l’annulation' })).toBeNull();
        expect(screen.queryByText('742 816')).toBeNull();
    });

    it('confirme le paiement au retrait sans Stripe et réinitialise la démonstration', () => {
        render(<OrderFlow />);
        click('Continuer');
        click('Retour au panier');
        click('Continuer');
        selectSlots();
        fireEvent.click(screen.getByRole('radio', { name: /Payer au retrait/ }));
        expect(screen.queryByText(/Emplacement du champ carte/)).toBeNull();
        click('Simuler la validation de commande');
        expect(screen.getByRole('heading', { name: 'Validation de la commande' })).toBeDefined();
        click('Simuler la confirmation de commande');
        preview('payment');
        expect(screen.getByRole('heading', { name: 'Rien à afficher pour le moment' })).toBeDefined();

        click('Réinitialiser la démo');
        expect(screen.getByRole('button', { name: 'Ajouter un Pain au levain' })).toBeDefined();
        click('Mes commandes');
        expect(screen.queryByRole('button', { name: /SL-2051/ })).toBeNull();
    });

    it.each(['catalogue', 'cart', 'payment', 'confirmation', 'orders', 'detail'])(
        'expose les états de chargement, erreur, reprise et liste vide pour %s',
        (page) => {
            render(<OrderFlow />);
            preview(page);
            click('Chargement');
            expect(screen.getByRole('status').textContent).toContain('Un instant');
            click('Erreur');
            expect(screen.getByRole('alert').textContent).toContain('Impossible de charger cette page');
            click('Réessayer');
            expect(screen.queryByRole('alert')).toBeNull();
            expect(screen.getByRole('button', { name: 'Réussite', pressed: true })).toBeDefined();
            click('Vide');
            expect(screen.getByRole('heading', { name: 'Rien à afficher pour le moment' })).toBeDefined();
            click('Découvrir les commerces');
            expect(screen.getByRole('heading', { name: 'Les commerces du quartier' })).toBeDefined();
        },
    );

    it('peut fermer puis soumettre le dialogue de demande d’annulation', () => {
        const prototype = HTMLDialogElement.prototype;
        // JSDOM ne simule pas encore l'ouverture modale native.
        const methods = {
            showModal: function () { this.setAttribute('open', ''); },
            close: function () { this.removeAttribute('open'); },
        };
        for (const [name, method] of Object.entries(methods)) {
            if (!(name in prototype)) Object.defineProperty(prototype, name, { value: method, configurable: true });
        }

        const { unmount } = render(<OrderFlow />);
        try {
            click('Mes commandes');
            click(/SL-2048/);
            const trigger = screen.getByRole('button', { name: 'Demander l’annulation' });
            trigger.focus();
            fireEvent.click(trigger);
            expect(screen.getByRole('dialog', { name: 'Demander une annulation ?' })).toBeDefined();
            click('Fermer');
            expect(screen.queryByRole('dialog')).toBeNull();
            expect(document.activeElement).toBe(trigger);

            fireEvent.click(trigger);
            click('Simuler la demande');
            expect(screen.queryByRole('dialog')).toBeNull();
            expect(screen.getByRole('status').textContent).toContain('Aucune demande');
            expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Détail de commande' }));
        } finally {
            unmount();
            for (const [name, method] of Object.entries(methods)) {
                if (prototype[name] === method) delete prototype[name];
            }
        }
    });
});
