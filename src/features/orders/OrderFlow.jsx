import { useMemo, useState } from 'react';
import ProductList from '../products/ProductList';
import {
    getCartTotal,
    getOrderStatus,
    INITIAL_CART,
    INITIAL_ORDERS,
    ORDER_STATUSES,
    ORDER_TRACKING_STEPS,
    STORES,
} from './orderFlowData';

const PREVIEW_STATES = [
    { id: 'success', label: 'Réussite' },
    { id: 'empty', label: 'Vide' },
    { id: 'loading', label: 'Chargement' },
    { id: 'error', label: 'Erreur' },
];

const CURRENCY_FORMATTER = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
});

function formatPrice(amount) {
    return CURRENCY_FORMATTER.format(amount);
}

function formatArticleCount(count) {
    return `${count} ${count === 1 ? 'article' : 'articles'}`;
}

function StatePanel({ state, onRetry, onBrowse }) {
    if (state === 'loading') {
        return (
            <div className="state-panel" role="status" aria-live="polite">
                <span className="spinner" aria-hidden="true" />
                <h2>Un instant…</h2>
                <p>Les informations se mettent à jour.</p>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className="state-panel state-panel--error" role="alert">
                <span className="state-icon" aria-hidden="true">!</span>
                <h2>Impossible de charger cette page</h2>
                <p>Vérifiez votre connexion, puis réessayez.</p>
                <button className="button button--secondary" type="button" onClick={onRetry}>
                    Réessayer
                </button>
            </div>
        );
    }

    if (state === 'empty') {
        return (
            <div className="state-panel">
                <span className="state-icon state-icon--soft" aria-hidden="true">♡</span>
                <h2>Rien à afficher pour le moment</h2>
                <p>Les articles et commandes apparaîtront ici.</p>
                {onBrowse && (
                    <button className="button button--primary" type="button" onClick={onBrowse}>
                        Découvrir les commerces
                    </button>
                )}
            </div>
        );
    }

    return null;
}

function StoreMark() {
    return <span className="store-mark" aria-hidden="true">S</span>;
}

export default function OrderFlow() {
    const [screen, setScreen] = useState('cart');
    const [previewState, setPreviewState] = useState('success');
    const [cart, setCart] = useState(INITIAL_CART);
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [pickupSlots, setPickupSlots] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [paymentPending, setPaymentPending] = useState(false);
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelRequested, setCancelRequested] = useState(false);

    const cartTotal = useMemo(() => getCartTotal(cart), [cart]);
    const visibleCart = previewState === 'empty' ? [] : cart;
    const activeOrder = orders.find((order) => order.id === activeOrderId);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    function updateQuantity(itemId, change) {
        setCart((items) => items
            .map((item) => item.id === itemId
                ? { ...item, quantity: Math.max(0, item.quantity + change) }
                : item)
            .filter((item) => item.quantity > 0));
    }

    function startPayment() {
        setPreviewState('success');
        setPaymentPending(false);
        setScreen('payment');
    }

    function completePayment() {
        const newOrder = {
            id: 'SL-2051',
            status: 'CONFIRMEE',
            total: cartTotal,
            createdAt: 'À l’instant',
            paymentMethod: paymentMethod === 'online' ? 'Paiement en ligne' : 'Paiement au retrait',
            pickupCode: '742 816',
            stores: [...new Set(cart.map((item) => (
                STORES.find((store) => store.id === item.storeId)?.name
            )).filter(Boolean))],
            pickupSlots: Object.fromEntries(STORES
                .filter((store) => cart.some((item) => item.storeId === store.id))
                .map((store) => [store.name, pickupSlots[store.id]])),
            refundDue: 0,
        };
        setOrders((items) => [newOrder, ...items]);
        setActiveOrderId(newOrder.id);
        setCart([]);
        setPaymentPending(false);
        setScreen('confirmation');
    }

    function openOrder(order) {
        setActiveOrderId(order.id);
        setCancelRequested(false);
        setCancelDialogOpen(false);
        setScreen('detail');
    }

    function changeOrderStatus(status) {
        if (!activeOrder) return;
        setOrders((items) => items.map((order) => order.id === activeOrder.id
            ? {
                ...order,
                status,
                refundDue: status === 'ANNULEE' && order.paymentMethod === 'Paiement en ligne'
                    ? order.total
                    : 0,
            }
            : order));
    }

    function navigate(nextScreen) {
        setScreen(nextScreen);
        setPreviewState('success');
        setPaymentPending(false);
    }

    const screenTitles = {
        catalogue: 'Commerces',
        cart: 'Mon panier',
        payment: 'Paiement',
        confirmation: 'Commande confirmée',
        orders: 'Mes commandes',
        detail: 'Détail de commande',
    };

    return (
        <div className="shoploc-app">
            <header className="app-header">
                <a className="brand" href="#accueil" onClick={(event) => {
                    event.preventDefault();
                    navigate('catalogue');
                }}>
                    <span className="brand-icon" aria-hidden="true">S</span>
                    <span>shoploc<span className="brand-dot">.</span></span>
                </a>
                <p className="city-label"><span aria-hidden="true">⌖</span> Lille, centre-ville</p>
                <button className="profile-button" type="button" aria-label="Profil de Camille">
                    <span aria-hidden="true">C</span>
                </button>
            </header>

            <nav className="primary-nav" aria-label="Navigation principale">
                <button
                    className={screen === 'catalogue' ? 'nav-item nav-item--active' : 'nav-item'}
                    type="button"
                    aria-current={screen === 'catalogue' ? 'page' : undefined}
                    onClick={() => navigate('catalogue')}
                >
                    Commerces
                </button>
                <button
                    className={screen === 'cart' || screen === 'payment' || screen === 'confirmation'
                        ? 'nav-item nav-item--active'
                        : 'nav-item'}
                    type="button"
                    aria-current={screen === 'cart' ? 'page' : undefined}
                    onClick={() => navigate('cart')}
                >
                    Panier <span className="nav-count" aria-label={`${cartCount} articles`}>{cartCount}</span>
                </button>
                <button
                    className={screen === 'orders' || screen === 'detail'
                        ? 'nav-item nav-item--active'
                        : 'nav-item'}
                    type="button"
                    aria-current={screen === 'orders' ? 'page' : undefined}
                    onClick={() => navigate('orders')}
                >
                    Mes commandes
                </button>
            </nav>

            <main className="page-shell">
                <section className="page-heading" aria-labelledby="page-title">
                    <div>
                        <p className="eyebrow">VOTRE COMMERCE DE PROXIMITÉ</p>
                        <h1 id="page-title">{screenTitles[screen]}</h1>
                    </div>
                    <span className="prototype-badge">Prototype · règles à valider PO</span>
                </section>

                <section className="preview-toolbar" aria-label="Contrôles de prévisualisation">
                    <div>
                        <p className="preview-title">État de l’écran</p>
                        <p className="preview-description">Aperçu provisoire pour revue de conception</p>
                    </div>
                    <div className="preview-options" role="group" aria-label="Choisir un état d’interface">
                        {PREVIEW_STATES.map((state) => (
                            <button
                                className={previewState === state.id ? 'preview-option preview-option--active' : 'preview-option'}
                                type="button"
                                key={state.id}
                                aria-pressed={previewState === state.id}
                                onClick={() => {
                                    setPreviewState(state.id);
                                    setPaymentPending(false);
                                }}
                            >
                                {state.label}
                            </button>
                        ))}
                    </div>
                </section>

                {screen === 'catalogue' && (
                    <section className="content-card" aria-labelledby="catalogue-title">
                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">À DEUX PAS DE CHEZ VOUS</p>
                                <h2 id="catalogue-title">Les commerces du quartier</h2>
                            </div>
                            <span className="result-count">Catalogue</span>
                        </div>
                        {previewState === 'success'
                            ? <ProductList />
                            : <StatePanel
                                state={previewState}
                                onRetry={() => setPreviewState('success')}
                                onBrowse={() => setPreviewState('success')}
                            />}
                    </section>
                )}

                {screen === 'cart' && (
                    <CartScreen
                        cart={visibleCart}
                        cartTotal={cartTotal}
                        previewState={previewState}
                        onRetry={() => setPreviewState('success')}
                        onBrowse={() => navigate('catalogue')}
                        onQuantityChange={updateQuantity}
                        onCheckout={startPayment}
                    />
                )}

                {screen === 'payment' && (
                    <PaymentScreen
                        cartTotal={cartTotal}
                        cart={cart}
                        pickupSlots={pickupSlots}
                        previewState={previewState}
                        paymentMethod={paymentMethod}
                        paymentPending={paymentPending}
                        onPaymentMethodChange={setPaymentMethod}
                        onPickupSlotChange={(storeId, slot) => setPickupSlots((current) => ({
                            ...current,
                            [storeId]: slot,
                        }))}
                        onRetry={() => setPreviewState('success')}
                        onBrowse={() => navigate('catalogue')}
                        onBack={() => navigate('cart')}
                        onPay={() => setPaymentPending(true)}
                        onComplete={completePayment}
                    />
                )}

                {screen === 'confirmation' && (
                    <ConfirmationScreen
                        order={activeOrder}
                        previewState={previewState}
                        onRetry={() => setPreviewState('success')}
                        onBrowse={() => navigate('catalogue')}
                        onOrders={() => navigate('orders')}
                    />
                )}

                {screen === 'orders' && (
                    <OrdersScreen
                        orders={previewState === 'empty' ? [] : orders}
                        previewState={previewState}
                        onRetry={() => setPreviewState('success')}
                        onBrowse={() => navigate('catalogue')}
                        onOpen={openOrder}
                    />
                )}

                {screen === 'detail' && (
                    <OrderDetailScreen
                        order={previewState === 'empty' ? null : activeOrder}
                        previewState={previewState}
                        cancelRequested={cancelRequested}
                        cancelDialogOpen={cancelDialogOpen}
                        onRetry={() => setPreviewState('success')}
                        onBrowse={() => navigate('catalogue')}
                        onBack={() => navigate('orders')}
                        onStatusChange={changeOrderStatus}
                        onOpenCancel={() => setCancelDialogOpen(true)}
                        onCloseCancel={() => setCancelDialogOpen(false)}
                        onSubmitCancel={(event) => {
                            event.preventDefault();
                            setCancelRequested(true);
                            setCancelDialogOpen(false);
                        }}
                    />
                )}

                <p className="prototype-note">
                    Prototype de travail GLOP-95. Les règles de panier multi-commerces, de paiement
                    et d’annulation restent à confirmer par le PO.
                </p>
            </main>
        </div>
    );
}

function CartScreen({ cart, cartTotal, previewState, onRetry, onBrowse, onQuantityChange, onCheckout }) {
    const stores = STORES.filter((store) => cart.some((item) => item.storeId === store.id));

    if (previewState !== 'success') {
        return (
            <section className="content-card">
                <StatePanel state={previewState} onRetry={onRetry} onBrowse={onBrowse} />
            </section>
        );
    }

    if (cart.length === 0) {
        return (
            <section className="content-card">
                <StatePanel state="empty" onBrowse={onBrowse} />
            </section>
        );
    }

    return (
        <div className="checkout-layout">
            <section className="content-card cart-card" aria-labelledby="cart-items-title">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">TOUT AU MÊME ENDROIT</p>
                        <h2 id="cart-items-title">Votre sélection</h2>
                    </div>
                    <span className="result-count">{cart.length} références</span>
                </div>
                {stores.map((store) => {
                    const storeItems = cart.filter((item) => item.storeId === store.id);
                    const itemCount = storeItems.reduce((total, item) => total + item.quantity, 0);
                    return (
                        <article className="store-group" key={store.id}>
                            <div className="store-heading">
                                <StoreMark />
                                <div>
                                    <h3>{store.name}</h3>
                                    <p>{store.category} <span aria-hidden="true">·</span> {store.address}</p>
                                </div>
                                <span className="store-count">{formatArticleCount(itemCount)}</span>
                            </div>
                            <ul className="cart-items">
                                {storeItems.map((item) => (
                                    <li className="cart-item" key={item.id}>
                                        <div className="product-placeholder" aria-hidden="true">✳</div>
                                        <div className="product-description">
                                            <h4>{item.name}</h4>
                                            <p>{item.detail}</p>
                                            <span className="item-unit-price">{formatPrice(item.price)} / unité</span>
                                        </div>
                                        <div className="quantity-control" role="group" aria-label={`Quantité de ${item.name}`}>
                                            <button
                                                type="button"
                                                aria-label={`Retirer un ${item.name}`}
                                                onClick={() => onQuantityChange(item.id, -1)}
                                            >−</button>
                                            <span aria-live="polite">{item.quantity}</span>
                                            <button
                                                type="button"
                                                aria-label={`Ajouter un ${item.name}`}
                                                onClick={() => onQuantityChange(item.id, 1)}
                                            >+</button>
                                        </div>
                                        <strong className="item-total">{formatPrice(item.price * item.quantity)}</strong>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    );
                })}
                <p className="inline-hint"><span aria-hidden="true">ⓘ</span> Chaque commerce prépare votre commande séparément.</p>
            </section>

            <aside className="content-card summary-card" aria-labelledby="summary-title">
                <p className="eyebrow">RÉCAPITULATIF</p>
                <h2 id="summary-title">Votre commande</h2>
                <div className="summary-row">
                    <span>Articles ({cart.reduce((total, item) => total + item.quantity, 0)})</span>
                    <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="summary-row">
                    <span>Retrait en commerce</span>
                    <span className="free-label">Gratuit</span>
                </div>
                <div className="summary-total">
                    <span>Total estimé</span>
                    <strong>{formatPrice(cartTotal)}</strong>
                </div>
                <p className="summary-caption">Les créneaux seront choisis pour chaque commerce à l’étape suivante.</p>
                <button className="button button--primary button--wide" type="button" onClick={onCheckout}>
                    Continuer <span aria-hidden="true">→</span>
                </button>
                <p className="secure-caption"><span aria-hidden="true">⌑</span> Paiement sécurisé à l’étape suivante</p>
            </aside>
        </div>
    );
}

function PaymentScreen({
    cartTotal,
    cart,
    pickupSlots,
    previewState,
    paymentMethod,
    paymentPending,
    onPaymentMethodChange,
    onPickupSlotChange,
    onRetry,
    onBrowse,
    onBack,
    onPay,
    onComplete,
}) {
    const stores = STORES.filter((store) => cart.some((item) => item.storeId === store.id));
    const pickupSlotsReady = stores.every((store) => Boolean(pickupSlots[store.id]));

    if (previewState !== 'success') {
        return (
            <section className="content-card">
                <StatePanel state={previewState} onRetry={onRetry} onBrowse={onBrowse} />
            </section>
        );
    }

    if (cart.length === 0) {
        return (
            <section className="content-card">
                <StatePanel state="empty" onBrowse={onBrowse} />
            </section>
        );
    }

    return (
        <div className="checkout-layout">
            <section className="content-card payment-card" aria-labelledby="payment-title">
                {paymentPending ? (
                    <div className="payment-wait" role="status" aria-live="polite">
                        <span className="spinner" aria-hidden="true" />
                        <p className="eyebrow">{paymentMethod === 'online' ? 'PAIEMENT SÉCURISÉ' : 'COMMANDE'}</p>
                        <h2 id="payment-title">
                            {paymentMethod === 'online' ? 'Confirmation en cours' : 'Validation de la commande'}
                        </h2>
                        <p>
                            {paymentMethod === 'online'
                                ? 'Nous attendons la confirmation de votre prestataire de paiement.'
                                : 'Votre commande sera confirmée après validation.'}
                        </p>
                        {paymentMethod === 'online' && (
                            <>
                                <div className="stripe-placeholder">
                                    <span className="stripe-wordmark" aria-label="Stripe">stripe</span>
                                    <span>Le champ de carte sécurisé Stripe apparaîtra ici.</span>
                                </div>
                                <p className="inline-hint">Aucune donnée de carte bancaire n’est saisie ou conservée par ShopLoc.</p>
                            </>
                        )}
                        <button className="button button--primary" type="button" onClick={onComplete}>
                            Simuler la confirmation de paiement
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">ÉTAPE 2 SUR 3</p>
                                <h2 id="payment-title">Retrait et paiement</h2>
                            </div>
                            <span className="step-indicator" aria-label="Étape 2 sur 3">02 / 03</span>
                        </div>
                        <section className="form-section" aria-labelledby="pickup-title">
                            <div className="form-section-heading">
                                <span className="number-badge" aria-hidden="true">1</span>
                                <div>
                                    <h3 id="pickup-title">Choisissez vos créneaux de retrait</h3>
                                    <p>Un créneau indépendant pour chaque commerce.</p>
                                </div>
                            </div>
                            <div className="pickup-list">
                                {stores.map((store) => (
                                    <label className="pickup-row" key={store.id}>
                                        <span className="pickup-store">
                                            <StoreMark />
                                            <span><strong>{store.name}</strong><small>{store.address}</small></span>
                                        </span>
                                        <select
                                            aria-label={`Créneau de retrait chez ${store.name}`}
                                            value={pickupSlots[store.id] ?? ''}
                                            onChange={(event) => {
                                                onPickupSlotChange(store.id, event.target.value);
                                            }}
                                        >
                                            <option value="" disabled>Choisir un créneau</option>
                                            {store.slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                                        </select>
                                    </label>
                                ))}
                            </div>
                            <p className="inline-hint"><span aria-hidden="true">ⓘ</span> Le retrait se fait directement auprès de chaque commerçant.</p>
                        </section>

                        {!pickupSlotsReady && (
                            <p className="validation-hint" role="status">
                                Choisissez un créneau pour chaque commerce afin de continuer.
                            </p>
                        )}

                        <section className="form-section" aria-labelledby="payment-method-title">
                            <div className="form-section-heading">
                                <span className="number-badge" aria-hidden="true">2</span>
                                <div>
                                    <h3 id="payment-method-title">Mode de paiement</h3>
                                    <p>Choisissez comment régler votre commande.</p>
                                </div>
                            </div>
                            <div className="payment-options">
                                <label className={paymentMethod === 'online' ? 'payment-option payment-option--selected' : 'payment-option'}>
                                    <input
                                        type="radio"
                                        name="payment-method"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={() => onPaymentMethodChange('online')}
                                    />
                                    <span className="radio-custom" aria-hidden="true" />
                                    <span className="payment-option-copy">
                                        <strong>Payer en ligne</strong>
                                        <small>Carte bancaire via Stripe</small>
                                    </span>
                                    <span className="payment-brand" aria-label="Stripe">stripe</span>
                                </label>
                                <label className={paymentMethod === 'pickup' ? 'payment-option payment-option--selected' : 'payment-option'}>
                                    <input
                                        type="radio"
                                        name="payment-method"
                                        value="pickup"
                                        checked={paymentMethod === 'pickup'}
                                        onChange={() => onPaymentMethodChange('pickup')}
                                    />
                                    <span className="radio-custom" aria-hidden="true" />
                                    <span className="payment-option-copy">
                                        <strong>Payer au retrait</strong>
                                        <small>Modalité à confirmer avec le PO</small>
                                    </span>
                                    <span className="payment-option-icon" aria-hidden="true">⌑</span>
                                </label>
                            </div>
                        </section>
                        <div className="payment-actions">
                            <button className="button button--text" type="button" onClick={onBack}>
                                <span aria-hidden="true">←</span> Retour au panier
                            </button>
                            <button
                                className="button button--primary"
                                type="button"
                                disabled={!pickupSlotsReady}
                                onClick={onPay}
                            >
                                {paymentMethod === 'online' ? 'Continuer vers Stripe' : 'Confirmer la commande'}
                                <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </>
                )}
            </section>

            {!paymentPending && (
                <aside className="content-card summary-card" aria-labelledby="payment-summary-title">
                    <p className="eyebrow">VOTRE COMMANDE</p>
                    <h2 id="payment-summary-title">Récapitulatif</h2>
                    {stores.map((store) => (
                        <div className="summary-store" key={store.id}>
                            <strong>{store.name}</strong>
                            <span>{cart.filter((item) => item.storeId === store.id).length} articles</span>
                        </div>
                    ))}
                    <div className="summary-total">
                        <span>Total à régler</span>
                        <strong>{formatPrice(cartTotal)}</strong>
                    </div>
                    <p className="summary-caption">Les créneaux et modalités de paiement sont présentés à titre provisoire, en attente d’arbitrage PO.</p>
                </aside>
            )}
        </div>
    );
}

function ConfirmationScreen({ order, previewState, onRetry, onBrowse, onOrders }) {
    if (previewState !== 'success') {
        return (
            <section className="content-card">
                <StatePanel state={previewState} onRetry={onRetry} onBrowse={onBrowse} />
            </section>
        );
    }

    if (!order) {
        return (
            <section className="content-card">
                <StatePanel state="empty" onBrowse={onBrowse} />
            </section>
        );
    }

    return (
        <section className="content-card confirmation-card" aria-labelledby="confirmation-title">
            <div className="success-icon" aria-hidden="true">✓</div>
            <p className="eyebrow">C’EST DANS LA POCHE</p>
            <h2 id="confirmation-title">Merci, votre commande est confirmée !</h2>
            <p className="confirmation-lead">Chaque commerce prépare vos articles pour le créneau choisi.</p>
            <div className="order-reference">Commande <strong>{order.id}</strong></div>
            <div className="pickup-codes" aria-label="Codes de retrait">
                {order.stores.map((store) => (
                    <div className="pickup-code-card" key={store}>
                        <span className="code-store">{store}</span>
                        <span className="code-number" aria-label={`Code de retrait ${order.pickupCode}`}>
                            {order.pickupCode}
                        </span>
                        {order.pickupSlots?.[store] && (
                            <span className="code-slot">{order.pickupSlots[store]}</span>
                        )}
                        <span className="code-caption">À présenter au retrait</span>
                    </div>
                ))}
            </div>
            <p className="confirmation-hint"><span aria-hidden="true">ⓘ</span> Vous retrouverez ces informations dans « Mes commandes ».</p>
            <div className="confirmation-actions">
                <button className="button button--secondary" type="button" onClick={onOrders}>Suivre mes commandes</button>
                <button className="button button--primary" type="button" onClick={onBrowse}>Continuer mes achats</button>
            </div>
        </section>
    );
}

function OrdersScreen({ orders, previewState, onRetry, onBrowse, onOpen }) {
    if (previewState !== 'success') {
        return (
            <section className="content-card">
                <StatePanel state={previewState} onRetry={onRetry} onBrowse={onBrowse} />
            </section>
        );
    }

    if (orders.length === 0) {
        return (
            <section className="content-card">
                <StatePanel state="empty" onBrowse={onBrowse} />
            </section>
        );
    }

    return (
        <section className="content-card orders-card" aria-labelledby="orders-title">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">VOTRE HISTORIQUE</p>
                    <h2 id="orders-title">Toutes vos commandes</h2>
                </div>
                <span className="result-count">{orders.length} commandes</span>
            </div>
            <ul className="orders-list">
                {orders.map((order) => {
                    const status = getOrderStatus(order.status);
                    return (
                        <li key={order.id}>
                            <button className="order-row" type="button" onClick={() => onOpen(order)}>
                                <span className="order-symbol" aria-hidden="true">⌑</span>
                                <span className="order-main">
                                    <span className="order-id">{order.id} <small>{order.createdAt}</small></span>
                                    <span className="order-stores">{order.stores.join(' · ')}</span>
                                    <StatusBadge status={status} />
                                </span>
                                <span className="order-trailing">
                                    <strong>{formatPrice(order.total)}</strong>
                                    <span aria-hidden="true">→</span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function StatusBadge({ status }) {
    if (!status) return null;
    return (
        <span className={`status-badge status-badge--${status.code.toLowerCase()}`}>
            <span className="status-dot" aria-hidden="true" />
            <span>{status.label}</span>
            <span className="status-code">{status.code}</span>
        </span>
    );
}

function OrderDetailScreen({
    order,
    previewState,
    cancelRequested,
    cancelDialogOpen,
    onRetry,
    onBrowse,
    onBack,
    onStatusChange,
    onOpenCancel,
    onCloseCancel,
    onSubmitCancel,
}) {
    if (previewState !== 'success') {
        return (
            <section className="content-card">
                <StatePanel state={previewState} onRetry={onRetry} onBrowse={onBrowse} />
            </section>
        );
    }

    if (!order) {
        return (
            <section className="content-card">
                <StatePanel state="empty" onBrowse={onBrowse} />
            </section>
        );
    }

    const status = getOrderStatus(order.status);
    const terminal = ['COLLECTEE', 'ANNULEE', 'EXPIREE'].includes(order.status);

    return (
        <div className="detail-layout">
            <section className="content-card order-detail-card" aria-labelledby="detail-title">
                <button className="button button--text back-link" type="button" onClick={onBack}>
                    <span aria-hidden="true">←</span> Retour aux commandes
                </button>
                <div className="detail-heading">
                    <div>
                        <p className="eyebrow">{order.createdAt}</p>
                        <h2 id="detail-title">Commande {order.id}</h2>
                    </div>
                    <StatusBadge status={status} />
                </div>
                <section className="tracking-section" aria-labelledby="tracking-title">
                    <h3 id="tracking-title">Suivi de votre commande</h3>
                    <ol className="tracking-list" aria-label="Étapes principales de la commande">
                        {ORDER_TRACKING_STEPS.map((item, index) => (
                            <li
                                className={order.status === item.code ? 'tracking-step tracking-step--current' : 'tracking-step'}
                                key={item.code}
                            >
                                <span className="tracking-marker" aria-hidden="true">{index + 1}</span>
                                <span className="tracking-copy">
                                    <strong>{item.label}</strong>
                                    <small>{item.code}</small>
                                </span>
                                {item.code === order.status && <span className="current-label">En cours</span>}
                            </li>
                        ))}
                    </ol>
                    {['ANNULEE', 'EXPIREE'].includes(order.status) && (
                        <div className="tracking-terminal" role="status">
                            <span className="terminal-branch" aria-hidden="true">↳</span>
                            <span>État terminal</span>
                            <StatusBadge status={status} />
                        </div>
                    )}
                </section>
                {order.status === 'ANNULEE' && order.refundDue > 0 && (
                    <div className="refund-banner" role="status">
                        <span className="refund-icon" aria-hidden="true">↗</span>
                        <span>
                            <strong>Remboursement dû : {formatPrice(order.refundDue)}</strong>
                            <small>Le suivi du remboursement sera affiché ici.</small>
                        </span>
                    </div>
                )}
                {cancelRequested && (
                    <div className="request-banner" role="status">
                        Votre demande d’annulation a été enregistrée. Elle doit être confirmée par le commerce.
                    </div>
                )}
                {!terminal && !cancelRequested && (
                    <button className="button button--secondary cancel-button" type="button" onClick={onOpenCancel}>
                        Demander l’annulation
                    </button>
                )}
                <details className="prototype-control">
                    <summary>Contrôle de statut · aperçu prototype</summary>
                    <label htmlFor="status-preview">Statut de la commande</label>
                    <select id="status-preview" value={order.status} onChange={(event) => onStatusChange(event.target.value)}>
                        {ORDER_STATUSES.map((item) => <option key={item.code} value={item.code}>{item.code} — {item.label}</option>)}
                    </select>
                    <p>Liste de statuts affichée pour revue ; transitions définitives à confirmer avec le PO.</p>
                </details>
                {cancelDialogOpen && (
                    <div className="dialog-backdrop">
                        <section className="cancel-dialog" role="dialog" aria-modal="true" aria-labelledby="cancel-title">
                            <button className="dialog-close" type="button" aria-label="Fermer" onClick={onCloseCancel}>×</button>
                            <p className="eyebrow">COMMANDE {order.id}</p>
                            <h3 id="cancel-title">Demander une annulation ?</h3>
                            <p>Le commerce devra confirmer votre demande. Les conditions de remboursement restent à préciser.</p>
                            <form onSubmit={onSubmitCancel}>
                                <label htmlFor="cancel-reason">Motif (facultatif)</label>
                                <textarea id="cancel-reason" name="reason" rows="3" placeholder="Indiquez le motif de votre demande" />
                                <div className="dialog-actions">
                                    <button className="button button--text" type="button" onClick={onCloseCancel}>Retour</button>
                                    <button className="button button--primary" type="submit">Envoyer la demande</button>
                                </div>
                            </form>
                        </section>
                    </div>
                )}
            </section>
            <aside className="content-card detail-summary" aria-labelledby="detail-summary-title">
                <p className="eyebrow">VOTRE RÉCAPITULATIF</p>
                <h3 id="detail-summary-title">Détails</h3>
                <div className="detail-meta"><span>Montant total</span><strong>{formatPrice(order.total)}</strong></div>
                <div className="detail-meta"><span>Paiement</span><strong>{order.paymentMethod}</strong></div>
                <div className="detail-store-list">
                    <h4>Commerces</h4>
                    {order.stores.map((store) => (
                        <p className="detail-store" key={store}>
                            <StoreMark />
                            <span>
                                {store}
                                {order.pickupSlots?.[store] && <small>{order.pickupSlots[store]}</small>}
                            </span>
                        </p>
                    ))}
                </div>
                {order.pickupCode && order.status !== 'ANNULEE' && order.status !== 'EXPIREE' && (
                    <div className="detail-pickup-code">
                        <span>Code de retrait</span>
                        <strong>{order.pickupCode}</strong>
                    </div>
                )}
            </aside>
        </div>
    );
}
