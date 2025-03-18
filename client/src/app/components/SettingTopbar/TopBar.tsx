import Image from 'next/image';
import styles from './TobBar.module.css';

const TopBar = () => {
  return (
    <div className={styles.topBar}>
      <Image
        className={styles.backIcon}
        width={32}
        height={32}
        alt="Back"
        src="/images/arrow-left.png"
      />
      <div className={styles.title}>설정</div>
    </div>
  );
};

export default TopBar;
