"use client";
import React from 'react';


const Button = ({ text, onClick, children }) => {
  return (
    <button
      className="bg-ivory font-secondary text-black border-black border-2 font-medium py-1.5 px-8 rounded-full flex justify-center items-center gap-12"
      onClick={onClick}
    >
      {children}
      {text}
    </button>
  );
};
export default Button;
