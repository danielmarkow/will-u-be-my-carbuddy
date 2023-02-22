import Link from "next/link";
import { useRouter } from "next/router";

import { useSession } from "next-auth/react";

import { ShareIcon, TrashIcon } from "@heroicons/react/20/solid";
import { toast } from "react-hot-toast";

import { api } from "../../utils/api";
import type Car from "../../types/carsType";

export default function CarCard({
  car,
  shared,
}: {
  car: Car;
  shared: boolean;
}) {
  const { data: sessionData } = useSession();

  const router = useRouter();
  const utils = api.useContext();

  const createInviteMutation = api.invite.createInvite.useMutation({
    onSuccess: (data) => {
      router.push(`/create-invite/${data}`).catch((err) => console.log(err));
    },
    onError: () => toast.error("Fehler beim Erstellen der Einladung"),
  });

  const deleteCarMutation = api.car.deleteCar.useMutation({
    onSuccess: () => {
      toast.success("Auto erfolgreich gelöscht");
      utils.car.dashboard.invalidate().catch((err) => console.log(err));
    },
  });

  return (
    <>
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
          {shared === false && (
            <>
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
              <button
                onClick={() => {
                  deleteCarMutation.mutate({ carId: car.id });
                }}
              >
                <TrashIcon className="ml-2 mt-1 h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
