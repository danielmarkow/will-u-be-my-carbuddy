import { type NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

import { api } from "../utils/api";
import Dashboard from "../components/Dashboard";

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
          <h1 className="mt-2 text-xl">Willkommen bei Carbuddy</h1>
          {sessionData ? (
            <Dashboard usersCars={usersCars} />
          ) : (
            <button
              className="mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => void signIn()}
            >
              Login
            </button>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
