import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import {TrinsicService} from "@trinsic/trinsic/lib/browser"

const trinsicService = new TrinsicService();

function App() {
  const [info, setInfo] = useState({ accountInfo: "", authToken: "" });
  useEffect(() => {
    const fetchAuthToken = async () => {
      const authToken = await trinsicService.account().loginAnonymous("default");
      const accountInfo = await trinsicService.account().getInfo();
      setInfo({ accountInfo: JSON.stringify(accountInfo, null, 4), authToken: authToken });
    };
    fetchAuthToken().catch((e) => console.error(e));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {info.authToken !== "" &&
          <div style={{ backgroundColor: "white", width: "50%", color: "red", }}>
            <pre style={{ textAlign: "left", paddingLeft: "15px", paddingRight: "15px", fontSize: "1rem", wordWrap: "break-word", wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
              {info.accountInfo}
              <br />
              Authentication token: {info.authToken}
            </pre>
          </div>}
        {info.authToken === "" && <div>
          <p>We're getting your account information</p>
        </div>}

      </header>
    </div>
  );
}

export default App;
