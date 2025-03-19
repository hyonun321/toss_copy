// BottomSheet.tsx
import React from 'react';
import { Backdrop, Sheet, Handle, Content } from './BottomSheet.style';

interface BottomSheetProps {
  children: React.ReactNode;
  height?: string; // Adjustable bottom sheet height
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  height = '25vh',
}) => {
  return (
    <>
      <Backdrop />
      <Sheet height={height}>
        <Handle />
        <Content>{children}</Content>
      </Sheet>
    </>
  );
};

export default BottomSheet;
