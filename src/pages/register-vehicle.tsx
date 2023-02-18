import { useSession } from "next-auth/react";

export default function RegisterVehicle() {
  const { data: sessionData } = useSession();

  return (
    <>
      {sessionData && (
        <>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">
            Neues Auto anlegen
          </h2>
          <p className="mt-1">Du bist Besitzer von...</p>
          <form className="mt-1">
            <div>
              <label
                htmlFor="maker"
                className="block text-sm font-medium text-gray-700"
              >
                Hersteller
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="maker"
                  placeholder="z.B. VW, Mercedes, Audi..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </form>
        </>
      )}
      {!sessionData && <p>Bitte einloggen</p>}
    </>
  );
}
