import { memo, ButtonHTMLAttributes } from 'react';
import '../styles/button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'small';
}

const Button = memo<ButtonProps>(({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className = '',
  ...props 
}) => {
  const variantClass = variant === 'secondary' ? 'custom-button-secondary' : '';
  const sizeClass = size === 'small' ? 'custom-button-small' : '';
  
  return (
    <button 
      className={`custom-button ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
