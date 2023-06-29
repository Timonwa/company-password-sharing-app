import React, { useEffect, Fragment } from "react";
import useStore from "../../store";
import Passage from "@passageidentity/passage-node";
import SuperAdminSecrets from "@/components/secrets/SuperAdminSecrets";
import TeamHeadSecrets from "@/components/secrets/TeamHeadSecrets";
import MemberSecrets from "@/components/secrets/MemberSecrets";
import DashboardButtons from "@/components/DashboardButtons";

const Dashboard = ({ userInfo }) => {
  const setUserData = useStore((state) => state.setUserData);
  const userData = useStore((state) => state.userData);
  const setActivePage = useStore((state) => state.setActivePage);
  const accountType = useStore((state) => state.accountType);

  useEffect(() => {
    setActivePage("Dashboard");
    setUserData(userInfo);
  }, [setUserData, userInfo, setActivePage]);

  useEffect(() => {
    require("@passageidentity/passage-elements/passage-profile");
  }, []);

  if (!userData) {
    return null; // Or render a loading state if necessary
  }

  return (
    <Fragment>
      {accountType === "Super Admin" && (
        <Fragment>
          <DashboardButtons />
          <SuperAdminSecrets />
        </Fragment>
      )}
      {accountType === "Team Lead" && (
        <Fragment>
          <DashboardButtons />
          <TeamHeadSecrets />
        </Fragment>
      )}
      {accountType === "Member" && <MemberSecrets />}
    </Fragment>
  );
};

export async function getServerSideProps(context) {
  const passage = new Passage({
    appID: process.env.PASSAGE_APP_ID,
    apiKey: process.env.PASSAGE_API_KEY,
    authStrategy: "HEADER",
  });

  try {
    const authToken = context.req.cookies["psg_auth_token"];
    const req = {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    };
    const userID = await passage.authenticateRequest(req);
    if (userID) {
      const userInfo = await passage.user.get(userID);
      return {
        props: {
          isAuthorized: true,
          userInfo,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

export default Dashboard;
