export type ViewContainerProps = {
  children: React.ReactNode;
};
export function ViewContainer({ children }: ViewContainerProps) {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center', // 가로(수평) 중앙 정렬
        alignItems: 'center', // 세로(수직) 중앙 정렬
      }}
    >
      {children}
    </div>
  );
}
