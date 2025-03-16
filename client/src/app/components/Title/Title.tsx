import styles from './Title.module.css';

type TitleProps = {
  children: React.ReactNode; // JSX 요소를 받도록 수정
};

const Title = ({ children }: TitleProps) => {
  return <h1 className={styles.title}>{children}</h1>;
};

export default Title;
