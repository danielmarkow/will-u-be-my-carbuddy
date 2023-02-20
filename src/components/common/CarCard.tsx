import Link from "next/link";
import { useSession } from "next-auth/react";

import { ShareIcon } from "@heroicons/react/20/solid";

import type Car from "../../types/carsType";

import type { UseMutationResult } from "@tanstack/react-query";

// TODO figure out type of the mutation

export default function CarCard({
  car,
  createInviteMutation,
}: {
  car: Car;
  createInviteMutation?: UseMutationResult;
}) {
  const { data: sessionData } = useSession();

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
          {createInviteMutation !== undefined && (
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
          )}
        </div>
      </div>
    </>
  );
}
