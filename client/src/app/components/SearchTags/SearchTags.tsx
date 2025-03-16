'use client';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import {
  TagsContainer,
  Tag,
  RemoveTagButton,
  EmptyTagsMessage,
} from './SearchTags.style';

interface SearchTagsProps {
  initialTags?: string[];
  onTagRemove?: (tag: string) => void;
}

export function SearchTags({
  initialTags = ['SK하이닉스', '삼성', '네이버'],
  onTagRemove,
}: SearchTagsProps) {
  const [tags, setTags] = useState(initialTags);

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    if (onTagRemove) {
      onTagRemove(tag);
    }
  };

  return (
    <TagsContainer>
      {tags.length > 0 ? (
        tags.map((tag) => (
          <Tag key={tag}>
            {tag}
            <RemoveTagButton onClick={() => handleRemoveTag(tag)}>
              <FiX size={14} />
            </RemoveTagButton>
          </Tag>
        ))
      ) : (
        <EmptyTagsMessage>최근 검색어가 없습니다</EmptyTagsMessage>
      )}
    </TagsContainer>
  );
}
