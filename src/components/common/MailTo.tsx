import type { ReactNode } from "react";

// type EmailInput = {
//   email: string;
//   subject?: string;
//   body?: string;
//   children: string | ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>
// }

export default function MailTo({
  email,
  subject,
  body,
  children,
}: {
  email?: string;
  subject?: string;
  body?: string;
  children: string | ReactNode;
}) {
  let params = subject || body ? "?" : "";
  if (subject) params += `subject=${encodeURIComponent(subject)}`;
  if (body) params += `${subject ? "&" : ""}body=${encodeURIComponent(body)}`;

  return <a href={`mailto:${email as string}${params}`}>{children}</a>;
}
