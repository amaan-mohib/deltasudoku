import React, { useEffect, useState } from "react";
import { Router, Switch, Link, Route } from "react-router-dom";
import Sudoku from "./Sudoku";
import { AnimatePresence, motion } from "framer-motion";
import { appHistory } from "./Navbar";
import Login from "./Login";
import { RiSettings3Line } from "react-icons/ri";
import Settings from "./Settings";
import { Helmet } from "react-helmet";

const TitleComp = ({ title }) => {
  const defaultTitle = "δ Sudoku";
  return (
    <Helmet>
      <title>{title ? `δ Sudoku - ${title}` : defaultTitle}</title>
    </Helmet>
  );
};

const withTitle = ({ ChildComp, title }) => (props) => (
  <>
    <TitleComp title={title} />
    <ChildComp {...props} />
  </>
);
function App() {
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
  useEffect(() => {
    let ls = localStorage.getItem("theme");
    if (ls) {
      setTheme(ls);
      applyTheme(ls === "dark" ? "light" : "dark");
    }
  }, []);
  const Home = () => {
    return (
      <motion.div
        className="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        <div>
          <h1>δ Sudoku</h1>
          <Link to="/game">
            <button className="newGame signOut" style={{ width: "100%" }}>
              Play
            </button>
          </Link>
          <div>
            <Link to="/settings">
              <button className="themeBut" style={{ marginLeft: 0 }}>
                <RiSettings3Line />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };
  const Temp = () => {
    useEffect(() => {
      setTimeout(() => {
        appHistory.goBack();
      }, 100);
    }, []);
    return (
      <div className="home">
        <div className="loader"></div>
      </div>
    );
  };
  const HomeComp = withTitle({ ChildComp: Home });
  const GameComp = withTitle({ ChildComp: Sudoku, title: "Game" });
  const LoginComp = withTitle({ ChildComp: Login, title: "Login" });
  const SettingsComp = withTitle({ ChildComp: Settings, title: "Settings" });
  return (
    <Router history={appHistory}>
      <Switch>
        <Route path="/" exact>
          <AnimatePresence>
            <HomeComp />
          </AnimatePresence>
        </Route>
        <Route path="/game">
          <GameComp />
        </Route>
        <Route path="/new">
          <Temp />
        </Route>
        <Route path="/login">
          <LoginComp />
        </Route>
        <Route path="/settings">
          <AnimatePresence>
            <SettingsComp />
          </AnimatePresence>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
