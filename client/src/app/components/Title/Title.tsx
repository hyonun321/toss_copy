import { StyledTitle } from './styles';

type TitleProps = {
  children: React.ReactNode;
};

export const Title = ({ children }: TitleProps) => {
  return <StyledTitle>{children}</StyledTitle>;
};
