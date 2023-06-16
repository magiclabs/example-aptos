import { useState, useEffect } from "react";
import { Magic } from "magic-sdk";
import { OpenIdExtension } from "@magic-ext/oidc";

import magicLogo from "./assets/magic.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

const magic = new Magic(import.meta.env.VITE_MAGIC_API_KEY, {
  extensions: [new OpenIdExtension()],
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    magic.user.isLoggedIn().then(async (magicIsLoggedIn: boolean) => {
      if (magicIsLoggedIn) {
        const metadata = await magic.user.getMetadata();
        setUserMetadata(metadata);

        setIsLoggedIn(true);
      } else {
        setUserMetadata(null);
      }
    });
  }, [isLoggedIn]);

  const handleLogout = async () => {
    googleLogout();
    await magic.user.logout();
    setIsLoggedIn(false);
  };

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={magicLogo} className="logo magic" alt="Magic logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Magic with OIDC + React</h1>

      <div className="container card">
        {userMetadata ? (
          <div
            style={{ width: "700px", overflow: "hidden", textAlign: "start" }}
          >
            <button onClick={handleLogout}>Logout</button>
            <h2>User metadata</h2>
            <pre className="code">{JSON.stringify(userMetadata, null, 2)}</pre>
          </div>
        ) : (
          <div className="container">
            <h3>Sign in with Google</h3>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                console.log(credentialResponse);

                await magic.openid.loginWithOIDC({
                  jwt: credentialResponse.credential,
                  providerId: import.meta.env.VITE_OIDC_PROVIDER_ID,
                });

                setIsLoggedIn(true);
              }}
              onError={() => {
                console.log("error");
              }}
            />
          </div>
        )}
      </div>

      <div className="container card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  );
}

export default App;
