import styled from '@emotion/styled';
import { theme } from '@/app/theme/theme';

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 16px;
  background-color: #fff;
  min-height: 46px;
`;

export const Tag = styled.div`
  display: flex;
  font-weight: 400;
  align-items: center;
  background-color: ${theme.colors.lightGray};
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 14px;
  color: ${theme.colors.darkGray};
`;

export const RemoveTagButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-left: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmptyTagsMessage = styled.div`
  font-size: 14px;
  color: #999;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
