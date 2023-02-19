type DarkButtonProps = {
  className?: string;
  children: string;
};

export default function DarkButton({
  className: inputClassNames,
  children,
}: DarkButtonProps) {
  let buttonClassNames =
    "inline-flex items-center rounded-md border border-transparent bg-black px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2" as string;

  if (inputClassNames !== undefined)
    buttonClassNames = (buttonClassNames + " " + inputClassNames) as string;

  return <button className={buttonClassNames}>{children}</button>;
}
