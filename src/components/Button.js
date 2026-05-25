import React from 'react';

function Button({ buttonClass = '', onClick, textValue, isIcon, ariaLabel }) {
  return (
    <button
      type="button"
      className={`calc-btn ${buttonClass}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel || (typeof textValue === 'string' ? textValue : undefined)}
    >
      {isIcon ? <i className={isIcon} aria-hidden="true" /> : textValue}
    </button>
  );
}

export default Button;
