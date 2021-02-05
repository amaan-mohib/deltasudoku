import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdChevronLeft } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { signOut } from "./Firebase";
import { motion } from "framer-motion";

export default function Settings() {
  const [signedIn, setSignedIn] = useState(false);
  const [show, setShow] = useState(true);
  const [user, setUser] = useState({ photoURL: "", displayName: "" });
  const [data, setData] = useState([]);
  useEffect(() => {
    let docRef, unsubscribe;
    const db = firebase.firestore();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setShow(false);
        setSignedIn(true);
        setUser(user);
        docRef = db.collection(user.uid);
        unsubscribe = docRef.orderBy("date", "desc").onSnapshot((query) => {
          setData(query.docs);
        });
      } else {
        setShow(false);
        unsubscribe && unsubscribe();
      }
    });
    if (firebase.auth().currentUser) setShow(false);
  }, []);
  const SignedIn = () => {
    const diff = (str) => {
      let res = "Easy";
      if (str === 19) res = "Easy";
      if (str === 28) res = "Medium";
      if (str === 37) res = "Hard";
      if (str === 64) res = "Insane";
      return res;
    };
    const time = (time) => {
      let date = new Date(0);
      date.setSeconds(time);
      return date.toISOString().substr(11, 8);
    };
    const Scores = () => {
      const onClick = (id) => {
        const db = firebase.firestore();
        const auth = firebase.auth();
        db.collection(auth.currentUser.uid)
          .doc(id)
          .delete()
          .then(() => console.log("Deleted"))
          .catch((err) => console.error(err));
      };

      return (
        <div className="scores">
          {data.map((doc, i) => {
            return (
              <div key={doc.id} className="settingsBanner">
                <p>{`${
                  i + 1
                }. ${doc.data().date.toDate().toDateString()}\t(${diff(
                  doc.data().difficulty
                )})`}</p>
                <div className="rightItems">
                  <p>{`${time(doc.data().time)}`}</p>
                  <button
                    className="themeBut"
                    title="Delete"
                    onClick={() => {
                      onClick(doc.id);
                    }}>
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    };
    return (
      <motion.div
        className="home2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        <div className="settingsBanner">
          <div className="leftItems">
            <Link to="/game">
              <h2 style={{ display: "flex" }}>
                <MdChevronLeft />
              </h2>
            </Link>
            <img className="pfp" src={user.photoURL} />
            <h4>{user.displayName}</h4>
          </div>
          <button
            className="newGame signOut"
            onClick={() => {
              signOut();
            }}>
            Sign Out
          </button>
        </div>
        {data.length > 0 ? (
          <Scores />
        ) : (
          <p className="pText">No games played</p>
        )}
      </motion.div>
    );
  };
  return signedIn ? <SignedIn /> : show ? <Loader /> : <SignedOut />;
}

const Loader = () => {
  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <div className="loader"></div>
    </motion.div>
  );
};

const SignedOut = () => {
  return (
    <>
      <motion.div
        className="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        <h2>
          <Link
            style={{ textDecoration: "underline", color: "Highlight" }}
            to="/login">
            Sign in
          </Link>{" "}
          to keep track of scores
        </h2>
        <Link to="/game">{"<"} Go Back</Link>
      </motion.div>
    </>
  );
};
