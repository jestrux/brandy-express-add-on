import React from "react";
import Login from "./Login";
import useLocalStorageState from "./hooks/useLocalStorageState";
import Home from "./Home";

const App = () => {
	const [user, saveUser] = useLocalStorageState("authUser", null);

	if (!user) return <Login onLogin={saveUser} />;

	return <Home onLogout={() => saveUser(null)} />;
};

export default App;
