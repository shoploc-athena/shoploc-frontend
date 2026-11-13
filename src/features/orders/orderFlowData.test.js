import { describe, expect, it } from 'vitest';
import {
    getCartTotal,
    getOrderStatus,
    INITIAL_CART,
    ORDER_STATUSES,
    ORDER_TRACKING_STEPS,
} from './orderFlowData';

describe('order flow data', () => {
    it('matches each customer-facing status to a machine status', () => {
        expect(ORDER_STATUSES.map(({ code }) => code)).toEqual([
            'CONFIRMEE',
            'EN_PREPARATION',
            'PRETE',
            'COLLECTEE',
            'ANNULEE',
            'EXPIREE',
        ]);
        expect(getOrderStatus('PRETE').label).toBe('Prête à retirer');
        expect(getOrderStatus('unknown')).toBeUndefined();
        expect(ORDER_TRACKING_STEPS.map(({ code }) => code)).toEqual([
            'CONFIRMEE',
            'EN_PREPARATION',
            'PRETE',
            'COLLECTEE',
        ]);
    });

    it('calculates the cart total from quantity and unit price', () => {
        expect(getCartTotal(INITIAL_CART)).toBeCloseTo(14.9);
    });
});
