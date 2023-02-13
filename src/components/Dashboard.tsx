import { useSession } from "next-auth/react";
import type { Car } from "../types/carsType";

export default function Dashboard({ usersCars }: { usersCars: Array<Car> }) {
  const { data: sessionData } = useSession();
  return (
    <>
      <h2>Dashboard - {sessionData?.user?.name}</h2>
      {JSON.stringify(usersCars)}
    </>
  );
}
