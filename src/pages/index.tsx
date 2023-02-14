import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { api } from "../utils/api";
import Dashboard from "../components/Dashboard";

import type { Car } from "../types/carsType";

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
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <h1 className="mt-2 text-xl">Carbuddy &hearts;</h1>
            {sessionData ? (
              <Dashboard usersCars={usersCars as Car[]} />
            ) : (
              <button
                className="mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => void signIn()}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
