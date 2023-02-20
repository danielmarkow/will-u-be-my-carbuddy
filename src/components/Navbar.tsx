import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";

export default function Navbar() {
  const { data: sessionData } = useSession();
  return (
    <>
      <div className="flex">
        <Link href={"/"}>
          <h1 className="text-xl text-gray-400">Carbuddy &hearts;</h1>
        </Link>
        {sessionData && (
          <button onClick={() => signOut()}>
            <ArrowLeftOnRectangleIcon className="ml-6 mt-0 h-5 w-5" />
          </button>
        )}
      </div>
    </>
  );
}
