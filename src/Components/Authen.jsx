import React, { useEffect, useRef, useState } from "react";
import {
  db,
  ref,
  set,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  provider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "./FirebaseConfig";
import Body from "./Body";
import Login from "./Login";

function Authen() {
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const emailRef = useRef(null);
  const passRef = useRef(null);

  const childReff = (e, p) => {
    emailRef.current = e;
    passRef.current = p;
  };

  const login = () => {
    setIsLoading(true);
    console.log(emailRef);

    if (emailRef.current === null || passRef.current === null) {
      setIsLoading(false);
      setErr("Email or password is missing");
      return;
    }
    const email = emailRef.current.value;
    const password = passRef.current.value;

    const promise = signInWithEmailAndPassword(auth, email, password);

    promise.then((userCredential) => {
      setIsLoading(false);
      setIsLoggedin(true);
      const user = userCredential.user;
      setErr("Welcome back, " + user.email.split("@")[0]);
    });

    promise.catch((error) => {
      setIsLoading(false);
      const err_msg = error.message;
      console.log("ERROR : " + error.code + " - " + err_msg);
      setErr(err_msg);
    });
  };

  const signup = () => {
    setIsLoading(true);

    if (emailRef.current === null || passRef.current === null) {
      setIsLoading(false);
      setErr("Email or password is missing");
      return;
    }

    const email = emailRef.current.value;
    const password = passRef.current.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoading(false);
        setIsLoggedin(true);
        const user = userCredential.user;
        const new_err = `Welcome, ${user.email.split("@")[0]}`;
        set(ref(db, "users/" + user.uid), {
          email: user.email,
        });
        setErr(new_err);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.code === "auth/email-already-in-use") {
          setErr("Error: The email address is already in use.");
        } else {
          const err_msg = error.message;
          setErr(err_msg);
        }
      });
  };

  const logout = () => {
    setIsLoading(true);
    const user = auth.currentUser;
    signOut(auth)
      .then(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
        setIsLoggedin(false);

        if (user.displayName === null) {
          setErr(
            "Thank you for using our application. Bye, " +
              user.email.split("@")[0]
          );
        } else {
          setErr(
            "Thank you for using our application. Bye, " + user.displayName
          );
        }
      })
      .catch((error) => {
        setIsLoading(false);
        const err_msg = error.message;
        console.log("ERROR : " + error.code + " - " + err_msg);
        setErr(err_msg);
      });
  };

  const google = () => {
    setIsLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsLoading(false);
        setIsLoggedin(true);
        const user = result.user;
        set(ref(db, "users/" + user.uid), {
          email: user.email,
          name: user.displayName,
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setErr(error.message);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`${errorCode} => ${errorMessage}`);
      });
  };

  //   Not Working
  const google_redirect = async () => {
    setIsLoading(true);
    await signInWithRedirect(auth, provider);
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setIsLoading(false);
          setIsLoggedin(true);
          const user = result.user;
          await set(ref(db, "users/" + user.uid), {
            email: user.email,
            name: user.displayName,
          });
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        setErr(error.message);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`${errorCode} => ${errorMessage}`);
      }
    };

    handleRedirectResult();
  }, []);

  const main_comp = isLoggedin ? (
    <Body
      user={auth.currentUser}
      setIsLoading={setIsLoading}
      isLoading={isLoading}
    />
  ) : (
    <Login childReff={childReff} />
  );

  return (
    <div>
      {main_comp}
      <div className={isLoading ? "loader" : "hide"}></div>
      <p className={isLoading || isLoggedin ? "hide" : ""}>{err}</p>
      <button className={isLoggedin ? "hide" : ""} onClick={login}>
        Log IN
      </button>
      <button className={isLoggedin ? "hide" : ""} onClick={signup}>
        Sign Up
      </button>
      <button className={isLoggedin ? "" : "hide"} onClick={logout}>
        Log Out
      </button>
      <br />
      <button className={isLoggedin ? "hide" : "google"} onClick={google}>
        Sign in with Google
      </button>
    </div>
  );
}

export default Authen;
