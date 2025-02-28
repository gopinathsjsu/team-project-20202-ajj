import React from 'react';

function Header({ onSignInClick }) {
  return (
    <header>
      <h1>OpenTable</h1>
      <nav>
        <button onClick={onSignInClick}>Sign In</button>
      </nav>
    </header>
  );
}

export default Header;