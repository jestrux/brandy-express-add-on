import React, { useState } from "react";
import Login from "./Login";
import useLocalStorageState from "./hooks/useLocalStorageState";
import Home from "./Home";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";

const LandingPage = ({ onLogin = () => {}, onRegister = () => {} }) => {
	return (
		<div>
			<img
				style={{ minHeight: "230px" }}
				className="w-full p-3"
				src="img/banner.png"
				alt=""
			/>

			<div style={{ marginTop: "-0.5rem", padding: "0 1.25rem" }}>
				<h1 className="leading-1 mb-2 text-xl">
					Single source of truth for all your brand assets
				</h1>

				<div className="leading-loose">
					<p>
						Brandy saves you hours generating, organizing and
						searching for things like logos, color palettes, product
						photos or fonts.
					</p>

					<p>
						We are the choice styleguide brand management platform
						for brands and agencies.
					</p>
				</div>
			</div>

			<div className="border-t" style={{ padding: "0.75rem 1.25rem" }}>
				<button className="mt-1 btn" onClick={onRegister}>
					Get started for free
				</button>

				<div className="mt-3 flex flex-col center-center gap-2">
					<span className="opacity-65 text-base">
						Already have a Brandy account?
					</span>
					<button
						className="hoverable bg-transparent border border-transparent font-medium"
						onClick={onLogin}
					>
						Login
					</button>
				</div>
			</div>
		</div>
	);
};

const App = () => {
	const [page, setPage] = useState("landing");
	const [user, saveUser] = useLocalStorageState("authUser", null);

	if (!user) {
		if (page == "register")
			return (
				<Register
					onGoBack={() => setPage("landing")}
					onLogin={() => setPage("login")}
					onRegister={saveUser}
				/>
			);

		if (page == "login")
			return (
				<Login
					onGoBack={() => setPage("landing")}
					onRegister={() => setPage("register")}
					onForgotPassword={() => setPage("forgot password")}
					onLogin={saveUser}
				/>
			);

		if (page == "forgot password")
			return (
				<ForgotPassword
					onGoBack={() => setPage("landing")}
					onRegister={() => setPage("register")}
					onLogin={saveUser}
				/>
			);

		return (
			<LandingPage
				onLogin={() => setPage("login")}
				onRegister={() => setPage("register")}
			/>
		);
	}

	return <Home onLogout={() => saveUser(null)} />;
};

export default App;
