import { useRouter } from "next/router";

export default function CarDetails() {
  const { carId } = useRouter().query;
  return (
    <>
      <h1>Auto Details - {carId}</h1>
    </>
  );
}
