import { useState } from 'react';
import ProductList from './features/products/ProductList';
import StoreDetail from './features/stores/StoreDetail';
import StoreDirectory from './features/stores/StoreDirectory';

const DEMO_STORES = [
  {
    id: 'maison-levain',
    name: 'Maison Levain',
    category: 'Boulangerie',
    address: '12 rue Nationale',
  },
];

export default function App() {
  const [section, setSection] = useState('catalogue');
  const [selectedStore, setSelectedStore] = useState(null);

  return (
      <main>
        <h1>ShopLoc</h1>
        <nav aria-label="Sections principales">
          <button
            type="button"
            aria-current={section === 'catalogue' ? 'page' : undefined}
            onClick={() => {
              setSection('catalogue');
              setSelectedStore(null);
            }}
          >
            Catalogue
          </button>
          <button
            type="button"
            aria-current={section === 'stores' ? 'page' : undefined}
            onClick={() => {
              setSection('stores');
              setSelectedStore(null);
            }}
          >
            Commerces
          </button>
        </nav>
        {section === 'catalogue' && (
          <section aria-labelledby="catalogue-title">
            <h2 id="catalogue-title">Catalogue</h2>
            <ProductList />
          </section>
        )}
        {section === 'stores' && (
          <section aria-labelledby="stores-title">
            <h2 id="stores-title">Commerces de démonstration</h2>
            {selectedStore
              ? (
                <StoreDetail
                  store={selectedStore}
                  status="success"
                  error={null}
                  onRetry={() => {}}
                  onBack={() => setSelectedStore(null)}
                />
              )
              : (
                <StoreDirectory
                  stores={DEMO_STORES}
                  status="success"
                  error={null}
                  onRetry={() => {}}
                  onSelect={setSelectedStore}
                />
              )}
          </section>
        )}
      </main>
  );
}