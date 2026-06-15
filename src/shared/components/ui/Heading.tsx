import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};

export function Heading({ children, level = 1, className }: Props) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  const sizeMap = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl",
    5: "text-lg md:text-xl",
    6: "text-base md:text-lg",
  };

  return (
    <Tag
      className={clsx(
        "font-serif italic text-text text-center leading-tight",
        sizeMap[level],
        className,
      )}>
      {children}
    </Tag>
  );
}
