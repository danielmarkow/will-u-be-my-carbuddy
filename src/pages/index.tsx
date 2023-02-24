import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { api } from "../utils/api";
import Dashboard from "../components/Dashboard";

import type Car from "../types/carsType";
import DarkButton from "../components/common/DarkButton";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: usersCars } = api.car.dashboard.useQuery(
    { userId: sessionData?.user?.id as string },
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <>
      <Head>
        <title>Carbuddy</title>
        <meta name="description" content="CarBuddy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {sessionData ? (
          <Dashboard usersCars={usersCars as Car[]} />
        ) : (
          <div className="flex flex-col items-center">
            <p className="text mt-2 text-center text-2xl">
              Willkommen bei CarBuddy - Einfache CarSharing Software für dich
              und deine Community
            </p>
            <DarkButton
              large={true}
              className="mt-10"
              onClick={() => void signIn()}
            >
              Login
            </DarkButton>
            <p className="mt-10 text-xl">(zukünftige) Features</p>
            <ul className="mt-2">
              <li>
                <div className="flex">
                  <CheckCircleIcon className="mr-1 mt-1 h-5 w-5" /> Typisierte
                  Nachrichten mit deinen Mit-Nutzern austauschen
                </div>
              </li>
              <li>
                <div className="flex">
                  <XCircleIcon className="mr-1 mt-1 h-5 w-5" />
                  Kalender zum Auto buchen
                </div>
              </li>
              <li>
                <div className="flex">
                  <XCircleIcon className="mr-1 mt-1 h-5 w-5" />
                  Geolocation des Autos hinterlegen
                </div>
              </li>
              <li>
                <div className="flex">
                  <XCircleIcon className="mr-1 mt-1 h-5 w-5" />
                  Email Benachrichtigungen
                </div>
              </li>
            </ul>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
