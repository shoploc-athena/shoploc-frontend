import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './productsSlice';
import ProductCatalog from './ProductCatalog';

export default function ProductList() {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.products);

    // Au premier affichage, on charge les produits
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return <ProductCatalog items={items} status={status} error={error} />;
}