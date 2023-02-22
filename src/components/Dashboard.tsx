import Link from "next/link";

import { useSession } from "next-auth/react";
import type Car from "../types/carsType";

import { api } from "../utils/api";
import CarCard from "./common/CarCard";

export default function Dashboard({ usersCars }: { usersCars: Array<Car> }) {
  const { data: sessionData } = useSession();

  const sharedCars = api.car.dashboardShared.useQuery(
    { userId: sessionData?.user?.id as string },
    {
      enabled: sessionData !== undefined,
    }
  );

  return (
    <>
      <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">
        Dashboard - {sessionData?.user?.name}
      </h2>
      <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
        Meine Autos
      </h3>
      {usersCars && usersCars.length > 0 ? (
        usersCars.map((car, carIdx) => <CarCard car={car} key={carIdx} />)
      ) : (
        <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3">
          <Link href={"/register-vehicle"}>
            <button className="inline-flex items-center rounded-md border border-transparent bg-black px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2">
              Auto registrieren
            </button>
          </Link>
        </div>
      )}
      {usersCars && usersCars.length !== 0 && (
        <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3">
          <Link href={"/register-vehicle"}>
            <button className="inline-flex items-center rounded-md border border-transparent bg-black px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2">
              Weiteres Auto registrieren
            </button>
          </Link>
        </div>
      )}
      <h3 className="mt-2 text-xl font-bold leading-tight tracking-tight text-gray-900">
        Weitere nutzbare Autos
      </h3>
      {sharedCars.data && sharedCars.data.length === 0 && (
        <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3">
          <span className="text-sm font-medium text-gray-900">
            Keine Autos mit dir geteilt
          </span>
        </div>
      )}
      {sharedCars.data &&
        sharedCars.data.length > 0 &&
        sharedCars.data.map((sharedCar, sharedCarIdx) => (
          <CarCard car={sharedCar.car} key={sharedCarIdx} />
        ))}
    </>
  );
}
