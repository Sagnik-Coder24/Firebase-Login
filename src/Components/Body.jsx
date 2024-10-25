import Answers from "./Answers";
import { db, ref, updateProfile, update, get, child } from "./FirebaseConfig";
import React, { useEffect, useRef, useState } from "react";

function Body({ user, setIsLoading, isLoading }) {
  const nameRef = useRef(null);
  const [name, setName] = useState(user.displayName);
  const [db_arr, setDb_arr] = useState({});

  let body = "";

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    updateProfile(user, {
      displayName: nameRef.current.value,
    })
      .then(() => {
        setIsLoading(false);
        setName(user.displayName);
        update(ref(db, "users/" + user.uid), {
          name: user.displayName,
        }).catch((error) => {
          console.error("Error updating user name:", error);
        });
        nameRef.current.value = "";
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const dbDataClick = () => {
    setIsLoading(true);
    get(child(ref(db), "users/")).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().email === user.email) {
            const newItem = {
              id: childSnapshot.key,
              name: childSnapshot.val().name,
              email: childSnapshot.val().email,
            };
            setDb_arr(newItem);
          }
          setIsLoading(false);
        });
      } else {
        console.log("No data available");
      }
    });
  };

  const temp_xml = (
    <>
      {JSON.stringify(db_arr) !== "{}" && !isLoading && (
        <Answers id={db_arr.id} name={db_arr.name} email={db_arr.email} />
      )}
    </>
  );

  if (name === null) {
    body = (
      <form onSubmit={handleSubmit}>
        <input type="text" ref={nameRef} placeholder="Enter your Name" />
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  } else {
    body = (
      <>
        <h1>Welcome, {name} </h1>
        <button onClick={dbDataClick}>Get Database Data</button>
        <br />
        <br />
        <hr className="hr" />
        {temp_xml}
      </>
    );
  }
  return <div>{body}</div>;
}

export default Body;
