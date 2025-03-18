import Image from 'next/image';
import styles from './UserInfo.module.css';

const UserInfo = ({ username, email }: { username: string; email: string }) => {
  return (
    <div className={styles.userInfoContainer}>
      <Image
        className={styles.avatarIcon}
        width={64}
        height={64}
        alt="User Avatar"
        src="/images/Avatars.png"
      />
      <div className={styles.userInfoText}>
        <b className={styles.username}>{username}</b>
        <div className={styles.email}>{email}</div>
      </div>
    </div>
  );
};

export default UserInfo;
