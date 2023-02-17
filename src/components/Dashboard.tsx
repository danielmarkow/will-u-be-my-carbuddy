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
      {usersCars &&
        usersCars.map((car) => (
          <div
            key={car.id}
            className="mt-2 h-96 rounded-lg border-4 border-gray-300"
          >
            <div className="border-3 m-5 h-40 rounded-lg border border-dotted border-gray-200">
              image placeholder
            </div>
            <p className="ml-5">{car.maker}</p>
            <p className="ml-5">{car.model}</p>
            <p className="ml-5">{car.licencePlate}</p>
            <Link href={`${car.id}`}>
              <button className="mt-2 ml-5 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Nachrichten
              </button>
            </Link>
          </div>
        ))}
    </>
  );
}
