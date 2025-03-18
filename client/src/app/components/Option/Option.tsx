import Image from 'next/image';
import styles from './Option.module.css';

interface SettingsOptionProps {
  iconSrc: string;
  label: string;
  hasToggle?: boolean;
  onClick?: () => void;
}

const SettingsOption = ({
  iconSrc,
  label,
  hasToggle,
  onClick,
}: SettingsOptionProps) => {
  return (
    <div className={styles.optionContainer} onClick={onClick}>
      <div className={styles.optionContent}>
        <Image
          className={styles.icon}
          width={24}
          height={24}
          alt={label}
          src={iconSrc}
        />
        <div className={styles.label}>{label}</div>
      </div>
      {hasToggle ? (
        <div className={styles.toggleSwitch}>
          <div className={styles.knob} />
        </div>
      ) : (
        <Image
          className={styles.chevronIcon}
          width={24}
          height={24}
          alt="Chevron"
          src="/images/chevron-right.png"
        />
      )}
    </div>
  );
};

export default SettingsOption;
