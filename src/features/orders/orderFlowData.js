export const ORDER_STATUSES = [
    { code: 'CONFIRMEE', label: 'Confirmée' },
    { code: 'EN_PREPARATION', label: 'En préparation' },
    { code: 'PRETE', label: 'Prête à retirer' },
    { code: 'COLLECTEE', label: 'Collectée' },
    { code: 'ANNULEE', label: 'Annulée' },
    { code: 'EXPIREE', label: 'Expirée' },
];

export const ORDER_TRACKING_STEPS = ORDER_STATUSES.filter(({ code }) => (
    ['CONFIRMEE', 'EN_PREPARATION', 'PRETE', 'COLLECTEE'].includes(code)
));

export const INITIAL_CART = [
    {
        id: 'bread',
        name: 'Pain au levain',
        detail: '700 g · fabrication du jour',
        price: 4.2,
        quantity: 1,
        storeId: 'boulangerie',
    },
    {
        id: 'croissant',
        name: 'Croissant pur beurre',
        detail: 'Lot de 2',
        price: 3.4,
        quantity: 2,
        storeId: 'boulangerie',
    },
    {
        id: 'apples',
        name: 'Pommes du verger',
        detail: 'Origine locale · 1 kg',
        price: 3.9,
        quantity: 1,
        storeId: 'primeur',
    },
];

export const STORES = [
    {
        id: 'boulangerie',
        name: 'Maison Levain',
        category: 'Boulangerie',
        address: '12 rue Nationale',
        slots: ['Aujourd’hui, 16 h – 17 h', 'Aujourd’hui, 17 h – 18 h', 'Demain, 9 h – 10 h'],
    },
    {
        id: 'primeur',
        name: 'Les Jardins de Léa',
        category: 'Primeur',
        address: '4 place du Marché',
        slots: ['Aujourd’hui, 17 h – 18 h', 'Demain, 10 h – 11 h'],
    },
];

export const INITIAL_ORDERS = [
    {
        id: 'SL-2048',
        status: 'EN_PREPARATION',
        total: 14.9,
        createdAt: 'Aujourd’hui · 10:42',
        paymentMethod: 'Paiement en ligne',
        pickupCode: '583 214',
        stores: ['Maison Levain', 'Les Jardins de Léa'],
        refundDue: 0,
    },
    {
        id: 'SL-1986',
        status: 'ANNULEE',
        total: 8.5,
        createdAt: 'Hier · 14:18',
        paymentMethod: 'Paiement en ligne',
        pickupCode: null,
        stores: ['Maison Levain'],
        refundDue: 8.5,
    },
];

export function getOrderStatus(code) {
    return ORDER_STATUSES.find((status) => status.code === code);
}

export function getCartTotal(items) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
