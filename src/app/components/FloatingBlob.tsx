interface FloatingBlobProps {
  color: string;
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: string;
}

export function FloatingBlob({ color, size, top, left, right, bottom, delay = '' }: FloatingBlobProps) {
  const position = {
    ...(top && { top }),
    ...(left && { left }),
    ...(right && { right }),
    ...(bottom && { bottom }),
  };

  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-40 animate-blob ${delay}`}
      style={{
        ...position,
        width: size,
        height: size,
        background: color,
      }}
    />
  );
}
