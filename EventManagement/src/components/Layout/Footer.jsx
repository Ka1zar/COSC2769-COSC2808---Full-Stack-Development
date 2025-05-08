import React from 'react';
import styles from './Footer.module.css'; // <-- Import CSS Module trong cùng folder 'Layout'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; 2025 Event Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;