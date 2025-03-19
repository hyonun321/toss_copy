import Image from 'next/image';

export function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <Image width={100} height={100} alt="로딩중" src="/images/loading.gif" />
    </div>
  );
}
