import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1>GridOS</h1>
      <p>Microgrid Energy Dispatch Optimization Platform</p>
    </header>
  );
};

export default Header;