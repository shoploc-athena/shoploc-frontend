export default function ProductCatalog({ items, status, error }) {
    if (status === 'idle' || status === 'loading') {
        return <p role="status" aria-live="polite">Chargement du catalogue…</p>;
    }

    if (status === 'failed') {
        return <p role="alert">Erreur : {error}</p>;
    }

    if (items.length === 0) {
        return <p role="status">Aucun produit disponible pour le moment.</p>;
    }

    return (
        <ul aria-label="Produits du catalogue">
            {items.map((product) => (
                <li key={product.id}>
                    {product.name} : {product.price} €
                </li>
            ))}
        </ul>
    );
}
