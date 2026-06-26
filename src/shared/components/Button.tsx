import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', style, ...props }) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return '#0070f3';
      case 'secondary': return '#eaeaea';
      case 'danger': return '#ff0000';
      default: return '#0070f3';
    }
  };

  const getTextColor = () => {
    return variant === 'secondary' ? '#000' : '#fff';
  };

  return (
    <button
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        cursor: 'pointer',
        fontWeight: 'bold',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
