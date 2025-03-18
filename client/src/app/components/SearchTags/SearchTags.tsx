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
  onTagClick?: (tag: string) => void; // 새로운 prop: 태그 클릭 이벤트
}

export function SearchTags({
  initialTags = [],
  onTagRemove,
  onTagClick,
}: SearchTagsProps) {
  const [tags, setTags] = useState(initialTags);

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    if (onTagRemove) {
      onTagRemove(tag);
    }
  };

  // 태그 클릭 핸들러
  const handleTagClick = (tag: string, event: React.MouseEvent) => {
    // 삭제 버튼을 클릭한 경우 태그 클릭 이벤트 방지
    if ((event.target as HTMLElement).closest('.remove-tag-button')) {
      return;
    }

    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <TagsContainer>
      {tags.length > 0 ? (
        tags.map((tag) => (
          <Tag
            key={tag}
            onClick={(e) => handleTagClick(tag, e)}
            style={{ cursor: 'pointer' }} // 클릭 가능함을 시각적으로 표시
          >
            {tag}
            <RemoveTagButton
              className="remove-tag-button"
              onClick={() => handleRemoveTag(tag)}
            >
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
