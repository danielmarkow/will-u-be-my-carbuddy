import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

import { api } from "../../utils/api";

import DarkButton from "../../components/common/DarkButton";
import { toast } from "react-hot-toast";

// When you open an invite link send
// to you to join in sharing someones
// car you get redirected here

export default function Invite() {
  const router = useRouter();
  const { inviteId } = router.query;

  const { data: sessionData } = useSession();

  const {
    data: inviteData,
    isLoading,
    isSuccess,
  } = api.invite.getInvite.useQuery(
    { inviteId: inviteId as string },
    { enabled: inviteId !== undefined }
  );

  const acceptInviteMutation = api.invite.acceptInvite.useMutation({
    onSuccess: () => {
      toast.success("Du kannst das Auto jetzt mit nutzen");
      void router.push("/");
    },
  });

  return (
    <>
      {inviteData && (
        <>
          <p>
            Du bist herzlich eingeladen &hearts; {inviteData?.creator.name}s{" "}
            {inviteData?.car.maker} {inviteData?.car.model} mit zu nutzen
          </p>
          {sessionData ? (
            <DarkButton
              onClick={() => {
                acceptInviteMutation.mutate({
                  userId: sessionData.user?.id as string,
                  carId: inviteData.car.id,
                  inviteId: inviteData.id,
                });
              }}
            >
              Mitmachen!
            </DarkButton>
          ) : (
            <DarkButton onClick={() => void signIn()}>Einloggen</DarkButton>
          )}
        </>
      )}
      {isLoading && <p>Link wird geprüft</p>}
      {!inviteData && isSuccess && (
        <p>Entschuldige aber der Link ist nicht mehr gültig</p>
      )}
    </>
  );
}
