import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';

export const SearchViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${theme.colors.white};
`;

export const SearchContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;
