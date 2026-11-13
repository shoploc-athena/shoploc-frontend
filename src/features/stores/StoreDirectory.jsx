export default function StoreDirectory({ stores, status, error, onRetry, onSelect }) {
    if (status === 'loading') {
        return <p role="status" aria-live="polite">Chargement des commerces…</p>;
    }

    if (status === 'error') {
        return (
            <div role="alert">
                <p>Impossible de charger les commerces : {error}</p>
                <button className="button button--secondary" type="button" onClick={onRetry}>
                    Réessayer
                </button>
            </div>
        );
    }

    if (status === 'empty' || stores.length === 0) {
        return <p role="status">Aucun commerce disponible pour le moment.</p>;
    }

    return (
        <ul className="store-directory" aria-label="Commerces à proximité">
            {stores.map((store) => (
                <li className="store-directory__item" key={store.id}>
                    <article className="store-directory__card">
                        <h3>{store.name}</h3>
                        <p>{store.category}</p>
                        <address>{store.address}</address>
                        <button
                            className="button button--secondary"
                            type="button"
                            onClick={() => onSelect(store)}
                        >
                            Voir la fiche de {store.name}
                        </button>
                    </article>
                </li>
            ))}
        </ul>
    );
}
