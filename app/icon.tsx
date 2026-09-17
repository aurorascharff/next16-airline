import { ImageResponse } from 'next/og';

export const size = { height: 64, width: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#245bff',
        borderRadius: 20,
        color: 'white',
        display: 'flex',
        fontSize: 34,
        fontWeight: 700,
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      W
    </div>,
    size,
  );
}
