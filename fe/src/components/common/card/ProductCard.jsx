import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { formatNumberWithCommas, maximizeString } from "../../../utils/stringUtils";
import { useNavigate } from "react-router-dom";
import { imgSrc } from "../../../utils/imgSrc";

const ProductCard = ({ product, className, ...props }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div {...props}
        initial={{ x: 10000, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        exit={{ x: -10000, opacity: 0 }}
        className={`flex flex-col items-center justify-center w-60 h-80 p-[10px] overflow-hidden rounded-lg shadow-lg cursor-pointer ${className} bg-[--secondary-background-color] text-[--secondary-text-color]`}
        onClick={() => navigate('/product/' + product?.path)}>
        <div className=" rounded-lg mt-2 ">
          <img className="w-auto h-[160px]" src={imgSrc(product?.image_url)} alt="" />
        </div>
        <div className="flex flex-col items-center justify-center mt-4">
          <h1 className="text-lg font-semibold">{maximizeString(product?.name, 40)}</h1>
          <p className="text-sm text-gray-500">{formatNumberWithCommas(product?.price)} {product?.currency}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProductCard;