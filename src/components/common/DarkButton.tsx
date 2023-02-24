type DarkButtonProps = {
  children: string;
  className?: string;
  onClick?: () => void;
  large?: boolean;
};

export default function DarkButton({
  children,
  className: inputClassNames,
  onClick,
  large = false,
}: DarkButtonProps) {
  let buttonClassNames = large
    ? "inline-flex items-center rounded-md border border-transparent bg-black px-8 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 text-xl focus:ring-offset-2"
    : ("inline-flex items-center rounded-md border border-transparent bg-black px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2" as string);

  if (inputClassNames !== undefined)
    buttonClassNames = buttonClassNames + " " + inputClassNames;

  return (
    <button className={buttonClassNames} onClick={onClick}>
      {children}
    </button>
  );
}
