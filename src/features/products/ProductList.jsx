import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './productsSlice';

export default function ProductList() {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.products);

    // Au premier affichage, on charge les produits
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (status === 'loading') return <p>Chargement…</p>;
    if (status === 'failed') return <p>Erreur : {error}</p>;

    return (
        <ul>
            {items.map((p) => (
                <li key={p.id}>
                    {p.name} : {p.price} €
                </li>
            ))}
        </ul>
    );
}