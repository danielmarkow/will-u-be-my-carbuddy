import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";

export default function Navbar() {
  const { data: sessionData } = useSession();
  return (
    <>
      <div className="flex justify-between">
        <Link href={"/"}>
          <h1 className="text-xl text-gray-400">Carbuddy &hearts;</h1>
        </Link>
        {sessionData && (
          <button title="Abmelden" onClick={() => void signOut()}>
            <div className="flex flex-row">
              <ArrowLeftOnRectangleIcon className="mt-1 h-6 w-6 fill-gray-400" />
              <span className="mt-1 ml-1 text-gray-400">Ausloggen</span>
            </div>
          </button>
        )}
      </div>
    </>
  );
}
