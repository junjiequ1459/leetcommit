import logo from "./logo.svg";
import NetworkPaste from "./component/NetworkPaste";
import "./App.css";
import DownloadButton from "./component/DownloadButton";

function App() {
  return (
    <div className="App">
      <NetworkPaste
        rows={8}
        cols={80}
        placeholder="Paste your text here"
        backgroundColor="#f0f0f0"
        resize="none"
      />
      <DownloadButton />
    </div>
  );
}

export default App;
