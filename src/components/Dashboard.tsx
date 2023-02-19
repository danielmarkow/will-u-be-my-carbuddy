import Link from "next/link";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";
import type { Car } from "../types/carsType";

import { ShareIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";

import { api } from "../utils/api";

// TODO create add car form if none is existant
export default function Dashboard({ usersCars }: { usersCars: Array<Car> }) {
  const { data: sessionData } = useSession();

  const router = useRouter();

  const createInviteMutation = api.invite.createInvite.useMutation({
    onSuccess: (data) => {
      router.push(`/create-invite/${data}`);
    },
    onError: () => toast.error("Fehler beim Erstellen der Einladung"),
  });

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
            className="mt-2 rounded-lg border-4 border-gray-300 p-1"
          >
            <p className="mt-1 ml-5">
              {car.maker} - {car.model} - {car.licencePlate}
            </p>
            <div className="flex">
              <Link href={`${car.id}`}>
                <button className="mt-1 ml-5 inline-flex items-center rounded-md border border-transparent bg-black px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2">
                  Nachrichten
                </button>
              </Link>
              <button
                onClick={() => {
                  createInviteMutation.mutate({
                    userId: sessionData?.user?.id as string,
                    carId: car.id,
                  });
                }}
              >
                <ShareIcon className="mt-1 ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        ))
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
      <div className="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3">
        <span className="text-sm font-medium text-gray-900">
          Keine Autos mit dir geteilt
        </span>
      </div>
    </>
  );
}
