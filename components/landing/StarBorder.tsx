import './StarBorder.css';
import React from 'react';

const StarBorder = ({
  as: Component = 'button',
  className = '',
  color = 'white',
  speed = '10s',
  thickness = 2,
  children,
  ...rest
}: any) => {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...rest.style
      }}
      {...rest}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="inner-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </Component>
  );
};

export default StarBorder;
