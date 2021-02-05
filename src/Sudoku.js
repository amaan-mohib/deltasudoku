import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { AnimatePresence, motion } from "framer-motion";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { Link } from "react-router-dom";
import { firebaseInit } from "./Firebase";

export default function Sudoku() {
  const [K, setK] = useState(19);
  const [getIndex, setIndex] = useState({ row: 1, col: 1, used: false });
  const [selected, setSelected] = useState(false);
  const [value, setValue] = useState(-1);
  const [stateChanged, setChange] = useState([{}]);
  const [color, setColor] = useState("modColor");
  const [won, setWon] = useState(false);
  const [anim, setAnim] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const ref = useRef(null);

  let changed = [{ row: -1, col: -1 }];
  let N = 9;
  const [grid, setGrid] = useState(
    Array(N)
      .fill(0)
      .map(() => Array(N))
  );
  const [unsolvedGrid, setUGrid] = useState([
    Array(N)
      .fill(0)
      .map(() => Array(N)),
  ]);
  useEffect(() => {
    firebaseInit();
    let grid = Array(N)
      .fill(0)
      .map(() => Array(N));

    let n = Math.sqrt(N);
    function checkBox(row, col, num) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (grid[row + i][col + j] == num) return false;
        }
      }
      return true;
    }
    function fillBox(row, col) {
      let num;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          while (!checkBox(row, col, num)) {
            num = Math.floor(Math.random() * N) + 1;
          }
          grid[row + i][col + j] = num;
        }
      }
    }
    function fillDiagonal() {
      for (let i = 0; i < N; i += n) fillBox(i, i);
    }
    function checkRow(i, num) {
      for (let j = 0; j < N; j++) {
        if (grid[i][j] == num) return false;
      }
      return true;
    }
    function checkCol(j, num) {
      for (let i = 0; i < N; i++) {
        if (grid[i][j] == num) return false;
      }
      return true;
    }
    function checkSafe(i, j, num) {
      return (
        checkRow(i, num) &&
        checkCol(j, num) &&
        checkBox(i - (i % n), j - (j % n), num)
      );
    }
    function fillRemaining(i, j) {
      if (j >= N && i < N - 1) {
        i += 1;
        j = 0;
      }
      if (i >= N && j >= N) return true;
      if (i < n) {
        if (j < n) j = n;
      } else if (i < N - n) {
        if (j == Math.floor(i / n) * n) j += n;
      } else {
        if (j == N - n) {
          i += 1;
          j = 0;
          if (i >= N) return true;
        }
      }
      for (let num = 1; num <= N; num++) {
        if (checkSafe(i, j, num)) {
          grid[i][j] = num;
          if (fillRemaining(i, j + 1)) return true;
          grid[i][j] = 0;
        }
      }
      return false;
    }
    function removeKDigits() {
      let count = K;
      //setSeconds(0);
      setSelected(false);
      setValue(-1);
      setIndex({ row: -1, col: -1, used: false });
      setWon(false);
      let mat = grid.map((el) => el.slice());
      while (count != 0) {
        let cellId = Math.floor(Math.random() * (N * N));
        let i = Math.floor(cellId / N);
        let j = cellId % N;
        //if (j != 0) j -= 1;
        if (i < 9 && j < 9 && mat[i][j] != "") {
          mat[i][j] = "";
          count--;
          changed.push({ row: i, col: j });
        }
      }
      console.log("Solved", grid);
      setChange(changed);
      setGrid(grid);
      setUGrid(mat);
    }
    function fillGrid() {
      fillDiagonal();
      fillRemaining(0, n);
      removeKDigits();
      //console.log("Unsolved", unSolvedGrid);
    }
    fillGrid();
  }, [K]);

  const list = {
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    hidden: { opacity: 0 },
  };
  const Table = () => {
    setTimeout(() => {
      setAnim(false);
    }, 1500);
    return (
      <motion.table className="sudoku">
        <tbody>
          {unsolvedGrid.map((rows, index) => {
            let row = rows.map((cell, index2) => (
              <motion.td
                variants={list}
                onClick={() => {
                  if (!won) {
                    setSelected(true);
                    setIndex({ row: index, col: index2, used: true });
                    setValue(cell);
                  }
                }}
                className={`element${
                  value === cell && cell !== "" ? " aqua" : ""
                }${
                  selected && getIndex.col === index2 && getIndex.row === index
                    ? " selected"
                    : ""
                } ${
                  stateChanged.some(
                    (change) => change.row === index && change.col === index2
                  ) && K < 37
                    ? color
                    : ""
                }`}
                key={index2}>
                <div className="content">{cell}</div>
              </motion.td>
            ));
            return (
              <motion.tr
                initial={anim ? "hidden" : ""}
                animate="visible"
                variants={list}
                className="row"
                key={index}>
                {row}
              </motion.tr>
            );
          })}
        </tbody>
      </motion.table>
    );
  };
  const NumPad = () => {
    let row1 = [1, 2, 3];
    let row2 = [4, 5, 6];
    let row3 = [7, 8, 9];
    let row4 = [...row1, ...row2, ...row3, "×"];

    const Data = (props) => {
      return (
        <td
          className="num"
          colSpan={props.data === "×" ? 3 : 1}
          key={props.index}
          onClick={() => {
            let c = 0;
            if (
              stateChanged.some(
                (change) =>
                  change.row === getIndex.row && change.col === getIndex.col
              ) &&
              getIndex.row >= 0 &&
              getIndex.col >= 0
            ) {
              let uMat = unsolvedGrid.map((el) => el.slice());
              uMat[getIndex.row][getIndex.col] =
                props.data === "×" ? "" : props.data;
              if (grid[getIndex.row][getIndex.col] === props.data)
                setColor("cellColor");
              else if (
                grid[getIndex.row][getIndex.col] <= props.data + 2 &&
                grid[getIndex.row][getIndex.col] >= props.data - 2
              )
                setColor("modColor");
              else setColor("wrongColor");
              setValue(props.data);
              setUGrid(uMat);
              for (let i = 0; i < N; i++) {
                for (let j = 0; j < N; j++) {
                  if (grid[i][j] === uMat[i][j]) {
                    c++;
                  }
                }
              }
              //console.log(c);
              if (c === N * N) {
                setTimeout(() => {
                  setWon(true);
                  setColor("");
                  setSelected(false);
                  setValue(-1);
                }, 400);
              }
            }
          }}>
          {props.data}
        </td>
      );
    };
    return (
      <motion.table
        key="numPad"
        // initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ x: 90, opacity: 0 }}
        className="numPad">
        <tbody className="l-scr">
          <tr>
            {row1.map((data, index) => (
              <Data key={index} data={data} index={index} />
            ))}
          </tr>
          <tr>
            {row2.map((data, index) => (
              <Data key={index} data={data} index={3 + index} />
            ))}
          </tr>
          <tr>
            {row3.map((data, index) => (
              <Data key={index} data={data} index={6 + index} />
            ))}
          </tr>
          <tr>
            <Data key={10} data="×" index={10} />
          </tr>
        </tbody>
        <tbody className="s-scr">
          <tr>
            {row4.map((data, index) => (
              <Data key={index} data={data} index={index} />
            ))}
          </tr>
        </tbody>
      </motion.table>
    );
  };

  return (
    <>
      <Navbar />
      <div className="scrBody1">
        <AnimatePresence>
          {!won ? (
            <motion.div
              className="tools"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <Tools onSetK={setK} setAnim={setAnim} />
              <Timer changed={K} setSeconds={setSeconds} />
            </motion.div>
          ) : (
            <Timer2 seconds={seconds} K={K} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="scrBody">
            <Table />
            <AnimatePresence initial={false}>
              {!won && <NumPad />}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
function useEffectSkipFirst(fn, arr) {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    return fn();
  }, arr);
}
const Timer2 = ({ seconds, K }) => {
  const [show, setShow] = useState(false);
  useEffectSkipFirst(() => {
    const db = firebase.firestore();
    let user = firebase.auth().currentUser;
    if (user) {
      let docRef = db.collection(user.uid);
      const { serverTimestamp } = firebase.firestore.FieldValue;
      docRef
        .add({
          date: serverTimestamp(),
          time: seconds,
          difficulty: K,
        })
        .then(() => {
          console.log("updated");
        })
        .catch((err) => console.error(err));
    } else setShow(true);
  }, [seconds]);
  return (
    <motion.div
      className="tools time"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}>
      {show && (
        <p>
          <Link
            to="/login"
            style={{ textDecoration: "underline", color: "Highlight" }}>
            Sign in
          </Link>{" "}
          to keep track of scores
        </p>
      )}
      <p style={{ fontWeight: "bold", marginTop: "10px" }}>{seconds}s</p>
    </motion.div>
  );
};
const Timer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const [change, setChange] = useState(0);

  const time = (time) => {
    let date = new Date(0);
    date.setSeconds(time);
    return date.toISOString().substr(11, 8);
  };
  const handleSec = useCallback(
    (s) => {
      props.setSeconds(s);
    },
    [props.setSeconds]
  );
  useEffect(() => {
    let s = 0;
    setChange(props.changed);
    setSeconds(0);
    //Timer
    let interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
      s++;
    }, 1000);
    return () => {
      handleSec(s);
      clearInterval(interval);
    };
  }, [props.changed, props.won]);
  return <div className="timer">{time(seconds)}</div>;
};
const Tools = (props) => {
  const [val, setVal] = useState("Easy");
  const handleChange = (e) => {
    setVal(e.target.value);
  };
  const handleK = useCallback(
    (e) => {
      if (e.target.value === "Easy") props.onSetK(19);
      if (e.target.value === "Medium") props.onSetK(28);
      if (e.target.value === "Hard") props.onSetK(37);
      if (e.target.value === "Insane") props.onSetK(64);
      props.setAnim(true);
    },
    [props.onSetK, props.setAnim]
  );

  return (
    <div>
      <select
        className="dropdown"
        value={val}
        onChange={(e) => {
          handleChange(e);
          handleK(e);
        }}>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
        <option value="Insane">Insane</option>
      </select>
    </div>
  );
};
