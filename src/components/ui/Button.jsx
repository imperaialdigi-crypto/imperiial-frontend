import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
  const baseStyle = "px-6 py-3 rounded-none font-medium transition-all duration-300 flex items-center justify-center gap-2 tracking-wide uppercase text-sm";
  
  // UPDATED: Now uses 'imperial' colors instead of 'brand'
  const variants = {
    primary: "bg-imperial-gold text-imperial-black hover:bg-imperial-goldLight hover:translate-y-[-1px]",
    outline: "border border-imperial-stone text-imperial-white hover:border-imperial-gold hover:text-imperial-gold bg-transparent",
    ghost: "text-imperial-gray hover:text-imperial-white bg-transparent"
  };

  return (
    <button 
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;