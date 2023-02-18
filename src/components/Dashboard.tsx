import { useSession } from "next-auth/react";
import type { Car } from "../types/carsType";
import Link from "next/link";

// TODO create add car form if none is existant
export default function Dashboard({ usersCars }: { usersCars: Array<Car> }) {
  const { data: sessionData } = useSession();
  return (
    <>
      <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">
        Dashboard - {sessionData?.user?.name}
      </h2>
      <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
        Meine Autos
      </h3>
      {usersCars && usersCars.length > 0 ? (
        usersCars.map((car) => (
          <div
            key={car.id}
            className="mt-2 h-80 rounded-lg border-4 border-gray-300"
          >
            <div className="border-3 m-5 flex h-36 items-center justify-center rounded-lg border-2 border-dotted border-gray-200">
              image placeholder
            </div>
            <p className="ml-5">{car.maker}</p>
            <p className="ml-5">{car.model}</p>
            <p className="ml-5">{car.licencePlate}</p>
            <Link href={`${car.id}`}>
              <button className="mt-2 ml-5 inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2">
                Nachrichten
              </button>
            </Link>
          </div>
        ))
      ) : (
        <div className="mt-2 flex h-80 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <Link href={"/register-vehicle"}>
            <button className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2">
              Auto registrieren
            </button>
          </Link>
        </div>
      )}
      <h3 className="mt-2 text-xl font-bold leading-tight tracking-tight text-gray-900">
        Weitere nutzbare Autos
      </h3>
      <div className="mt-2 flex h-80 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
        <span className="text-sm font-medium text-gray-900">
          Keine Autos mit dir geteilt
        </span>
      </div>
    </>
  );
}
