import {
  FaceFrownIcon,
  FireIcon,
  HandThumbUpIcon,
  XMarkIcon,
  SparklesIcon,
  MapPinIcon,
} from "@heroicons/react/20/solid";

export default function IconGenerator({
  value,
  className,
}: {
  value: string | null | undefined;
  className: string;
}) {
  switch (value) {
    case "parking":
      return <MapPinIcon className={className} />;
    case "fuel":
      return <FireIcon className={className} />;
    case "damage":
      return <FaceFrownIcon className={className} />;
    case "clean":
      return <SparklesIcon className={className} />;
    case "fluids":
      return <HandThumbUpIcon className={className} />;
    case "notdefined":
      return <XMarkIcon className={className} />;
    default:
      return <XMarkIcon className={className} />;
  }
}
