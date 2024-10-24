import React from "react";
import { useSelector } from "react-redux";

const ProductsByCategory = () => {
  const categories = useSelector(state => state.category.list);
  const products = useSelector(state => state.product.list);

  const category = window.location.pathname.split("/").reverse()[0];

  const categoryFound = categories.find(c => c.path === category);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-bold text-center mt-10 mb-5">{categoryFound?.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.filter(p => p.categoryId === categoryFound?.id).map(product => (
          <div key={product.id} className="bg-white shadow-md rounded-md p-5">
            <img src={product.imageUrl} alt={product.name} className="w-full h-60 object-cover" />
            <h2 className="text-xl font-bold mt-2">{product.name}</h2>
            <p className="text-gray-500">{product.description}</p>
            <p className="text-red-500 font-bold mt-2">{product.price}đ</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsByCategory;