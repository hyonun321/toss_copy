'use client';
import { SkeletonContainer, SkeletonTag } from './SkeletonSearchTags.style';

export function SkeletonSearchTags() {
  return (
    <SkeletonContainer>
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonTag key={i} />
      ))}
    </SkeletonContainer>
  );
}
