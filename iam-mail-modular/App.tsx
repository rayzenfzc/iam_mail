import React from 'react';
import ProductPage from './src/pages/ProductPage';

const App: React.FC = () => {
  return (
    <ProductPage 
      productId="MAIL" 
      onBack={() => console.log("Exit System")} 
    />
  );
};

export default App;