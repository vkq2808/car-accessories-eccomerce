import { motion } from "framer-motion";
import React from "react";
import { formatNumberWithCommas, maximizeString } from "../../utils/stringUtils";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, className, ...props }) => {
  const navigate = useNavigate();

  return (
    <motion.div {...props}
      className={`flex flex-col items-center justify-center w-60 h-80 p-[10px] bg-white overflow-hidden rounded-lg shadow-lg cursor-pointer ${className}`}
      onClick={() => navigate('/product/' + product.path)}>
      <div className=" bg-gray-300 rounded-lg mt-2 ">
        <img className="w-auto h-[160px]" src={product.imageUrl} alt="" />
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <h1 className="text-lg font-semibold">{maximizeString(product.name, 40)}</h1>
        <p className="text-sm text-gray-500">{formatNumberWithCommas(product.price)} {product.currency}</p>
      </div>
    </motion.div>
  );
}

export default ProductCard;