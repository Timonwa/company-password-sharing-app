import { Fragment } from "react";
import styles from "../../../styles/secrets/ViewSecretPopup.module.scss";
import useStore from "../../../store";

export function ViewSecretPopup({ onClose, item }) {
  const userTeams = useStore((state) => state.userTeams);

  // for each userTeams filter the team_id and return the team name that matches item.name
  const teamName = userTeams
    .filter((team) => team.id === item.pivot.team_id)
    .map((team) => team.name);

  // formate date from 2023-06-30T18:22:02.000000Z to 30/06/2023
  const date = new Date(item.updated_at);
  const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

  return (
    <section className={styles.viewSecretPopup}>
      <h1 className={styles.title}>{item.name}</h1>
      {item.type === "password" && (
        <div className={styles.wrapper}>
          <div>
            <h4>Website name:</h4>
            <p>{item.content.website}</p>
          </div>
          <div>
            <h4>Username or email:</h4>
            <p>{item.content.username}</p>
          </div>
          <div>
            <h4>Password:</h4>
            <p>{item.content.password}</p>
          </div>
          <div>
            <h4>Additional notes:</h4>
            <p>{item.notes}</p>
          </div>
          <div>
            <h4>Team:</h4>
            <p>{teamName}</p>
          </div>
          <div>
            <h4>Date:</h4>
            <p>{formattedDate}</p>
          </div>
        </div>
      )}
      <div className={styles.buttons}>
        <button className={styles.cancel} onClick={onClose}>
          Cancel
        </button>
      </div>
    </section>
  );
}
