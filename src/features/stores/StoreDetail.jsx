export default function StoreDetail({ store, status, error, onRetry, onBack }) {
    if (status === 'loading') {
        return <p role="status" aria-live="polite">Chargement de la fiche commerce…</p>;
    }

    if (status === 'error') {
        return (
            <div role="alert">
                <h2>Impossible de charger cette fiche commerce</h2>
                <p>{error}</p>
                <button className="button button--secondary" type="button" onClick={onRetry}>
                    Réessayer
                </button>
            </div>
        );
    }

    if (status === 'empty' || !store) {
        return (
            <div>
                <h2>Commerce introuvable</h2>
                <p>Cette fiche commerce n’est pas disponible.</p>
                <button className="button button--secondary" type="button" onClick={onBack}>
                    Retour aux commerces
                </button>
            </div>
        );
    }

    return (
        <article className="store-detail">
            <h2>{store.name}</h2>
            <p>{store.category}</p>
            <address>{store.address}</address>
            <button className="button button--secondary" type="button" onClick={onBack}>
                Retour aux commerces
            </button>
        </article>
    );
}
