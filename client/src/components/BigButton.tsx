import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'md' | 'lg' | 'xl';
  icon?: ReactNode;
}

export default function BigButton({
  children,
  variant = 'primary',
  size = 'lg',
  icon,
  disabled,
  className = '',
  ...props
}: BigButtonProps) {
  const baseClasses = 'btn-child focus-visible-ring flex items-center justify-center gap-3';
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 disabled:bg-gray-300',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 disabled:bg-gray-300',
    success: 'bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300',
  };

  const sizeClasses = {
    md: 'text-child-base px-6 py-3',
    lg: 'text-child-lg px-8 py-4',
    xl: 'text-child-xl px-10 py-5',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      {...(props as any)}
    >
      {icon && <span className="text-3xl">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
}
