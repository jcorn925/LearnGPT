import React, { useState } from 'react';
import styles from './FloatingMenu.module.scss';
import Icon from '@src/components/IconWrapper/Icon';
interface FloatingMenuItem {
  iconClassName: string;
  onClick?: () => void;
  title?: string;
  colorOnHover?: string;
  description?: string;
}

interface FloatingMenuProps {
  items: FloatingMenuItem[];
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.menuOpen}>
        {items.map((item, index) => (
          <div
            key={index}
            className={styles.card}
            onClick={item.onClick}
            title={item.title}
          >
            <div className={styles.cardContent}>
              <div
                className={styles.icon}
                style={{ color: isOpen ? item.colorOnHover : 'inherit' }}
              >
                <div className= {styles.iconContainer}>
                  <Icon id="add" size={16} color="grey"></Icon>
                </div>
              </div>
              <div className={styles.cardText}>
                {item.title && <span className={styles.title}>{item.title}</span>}
                {item.description && <p className={styles.description}>{item.description}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isOpen && <div className={styles.mask}></div>}
    </div>
  );
};

export default FloatingMenu;
