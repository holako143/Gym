import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseClasses = "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 text-base font-bold leading-normal tracking-[0.015em]";

  const variantClasses = {
    primary: 'bg-brand-green-accent text-brand-dark',
    secondary: 'bg-brand-green-medium text-white',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      <span className="truncate">{children}</span>
    </button>
  );
};

export default Button;