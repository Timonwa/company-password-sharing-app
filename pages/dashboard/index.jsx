import React, { useEffect, Fragment } from "react";
import useStore from "../../store";
import Passage from "@passageidentity/passage-node";

const Dashboard = ({ isAuthorized, userInfo }) => {
  const setUserData = useStore((state) => state.setUserData);
  const setActivePage = useStore((state) => state.setActivePage);
  const accountType = useStore((state) => state.accountType);
  const userData = useStore((state) => state.userData);

  useEffect(() => {
    setActivePage("Dashboard");
    setUserData(userInfo);
  }, [setUserData, userInfo, setActivePage]);

  useEffect(() => {
    require("@passageidentity/passage-elements/passage-profile");
  }, []);

  return (
    <Fragment>
      <h1>Dashboard {accountType}</h1>

      {/* {accountType === "Super Admin" && <SuperAdminDashboard />}
      {accountType === "Team Lead" && <TeamHeadDashboard />}
      {accountType === "User" && <MemberDashboard />} */}
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
      // user is authenticated
      const userInfo = await passage.user.get(userID);
      return {
        props: {
          isAuthorized: true,
          userInfo,
          // appID: passage.appID,
        },
      };
    }
  } catch (error) {
    // authentication failed
    console.error(error);
  }

  return {
    props: {
      isAuthorized: false,
      userInfo: null,
      // appID: passage.appID,
    },
  };
}

export default Dashboard;
