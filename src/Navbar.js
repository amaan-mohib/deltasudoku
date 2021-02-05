import React, { useEffect, useState } from "react";
import { AiFillBulb, AiOutlineBulb } from "react-icons/ai";
import { MdAdd } from "react-icons/md";
import { RiSettings3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { createBrowserHistory } from "history";
export const appHistory = createBrowserHistory();
export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const light = {
    "--primary-background": "white",
    "--primary-color": "black",
  };
  const dark = {
    "--primary-background": "rgb(29, 29, 29)",
    "--primary-color": "white",
  };
  const applyTheme = (nextTheme) => {
    const theme = nextTheme === "dark" ? light : dark;
    Object.keys(theme).map((key) => {
      const value = theme[key];
      document.documentElement.style.setProperty(key, value);
    });
  };
  const onClick = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(theme);
    localStorage.setItem("theme", nextTheme);
  };
  useEffect(() => {
    let ls = localStorage.getItem("theme");
    if (ls) {
      setTheme(ls);
      applyTheme(ls === "dark" ? "light" : "dark");
    }
  }, []);

  return (
    <nav>
      <Link to="/">
        <h1>δ Sudoku</h1>
      </Link>
      <div className="rightItems">
        <Link to="/new">
          <button className="newGame">New Game</button>
        </Link>
        <button
          title={`${theme === "light" ? "Dark" : "Light"} Theme`}
          className="themeBut"
          onClick={onClick}>
          {theme === "light" ? <AiOutlineBulb /> : <AiFillBulb />}
        </button>
        <Link to="/settings">
          <button className="themeBut" title="Settings">
            <RiSettings3Line />
          </button>
        </Link>
      </div>
      <Link className="newGameFab" to="/new">
        <button className="themeBut newGameFab">
          <MdAdd />
        </button>
      </Link>
    </nav>
  );
}
