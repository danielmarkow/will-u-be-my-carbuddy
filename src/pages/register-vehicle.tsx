import { useRouter } from "next/router";

import { FieldValues, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { api } from "../utils/api";
import { toast } from "react-hot-toast";

const schema = z.object({
  maker: z.string().min(1, "Bitte geb' mindestens ein Zeichen ein"),
  model: z.string().min(1, "Bitte geb' mindestens ein Zeichen ein"),
  licencePlate: z.string().min(1, "Bitte geb' mindestens ein Zeichen ein"),
});

export default function RegisterVehicle() {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const createCarMutation = api.car.createCar.useMutation({
    onSuccess: () => {
      toast.success("Auto erstellt");
      void router.push("/");
    },
    onError: () => {
      toast.error("Fehler beim Anlegen des Autos");
    },
  });

  type FormValues = {
    maker: string;
    model: string;
    licencePlate: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  type FormMutationInput = {
    maker: string;
    model: string;
    licencePlate: string;
    userId: string;
  };

  const onSubmit = (data: FieldValues) => {
    const submitData = { ...data, userId: sessionData?.user?.id };
    createCarMutation.mutate(submitData as FormMutationInput);
  };

  return (
    <>
      {sessionData && (
        <>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">
            Neues Auto anlegen
          </h2>
          <p className="mt-1">Du bist Besitzer von...</p>
          <form
            className="mt-1"
            onSubmit={handleSubmit((data) => onSubmit(data))}
          >
            <div>
              <label
                htmlFor="maker"
                className="mt-1 block text-sm font-medium text-gray-700"
              >
                Hersteller
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="maker"
                  placeholder="z.B. VW, Mercedes, Audi..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  {...register("maker")}
                />
                {errors && (
                  <p
                    className="mt-2 text-sm text-red-600"
                    id="licencePlate-error"
                  >
                    {errors.maker?.message as string}
                  </p>
                )}
              </div>
              <label
                htmlFor="model"
                className="mt-1 block text-sm font-medium text-gray-700"
              >
                Modell
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="model"
                  placeholder="z.B. C-Klasse, Golf 8..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  {...register("model")}
                />
                {errors && (
                  <p
                    className="mt-2 text-sm text-red-600"
                    id="licencePlate-error"
                  >
                    {errors.model?.message as string}
                  </p>
                )}
              </div>
              <label
                htmlFor="licencePlate"
                className="mt-1 block text-sm font-medium text-gray-700"
              >
                Kennzeichen
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="licencePlate"
                  placeholder="z.B. BSMD123..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  {...register("licencePlate")}
                />
                {errors && (
                  <p
                    className="mt-2 text-sm text-red-600"
                    id="licencePlate-error"
                  >
                    {errors.licencePlate?.message as string}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="mt-2 inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Speichern
            </button>
          </form>
        </>
      )}
      {!sessionData && <p>Bitte einloggen</p>}
    </>
  );
}
