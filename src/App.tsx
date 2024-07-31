import { useCallback, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { Header } from "./components/Header";
import { Panels } from "./components/Panels";
import { Editor } from "./components/Editor";
import { RendererWrapper } from "./components/Renderer";
import { Preferences } from "./components/Preferences";
import { Share } from "./components/Share";
import { Prompt } from "./components/Prompt";
import { Sidebar } from "./components/Sidebar";
import { useUserOptions } from "./stores/user-options";
import "./App.css";

function App() {
  const [showPrompt, setShowPrompt] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const options = useUserOptions();

  const handlePromptClick = useCallback(() => {
    setShowPrompt((value) => !value);
  }, []);

  const handlePreferencesClick = useCallback(() => {
    setShowPreferences((value) => !value);
  }, []);

  const handleShareClick = useCallback(() => {
    setShowShare((value) => !value);
  }, []);

  return (
    <ReactFlowProvider>
      <div className="flex overflow-hidden flex-col w-full h-full">
        <Header
          onPreferencesClick={handlePreferencesClick}
          onShareClick={handleShareClick}
          // TODO: Change
          onDeployClick={handlePromptClick}
        />
        <main className="flex flex-1">
          {options.general.sidebarOpen && <Sidebar />}
          <Panels editorChildren={<Editor />} rendererChildren={<RendererWrapper />} />
        </main>
        <Prompt isOpen={showPrompt} onClose={handlePromptClick} />
        <Preferences isOpen={showPreferences} onClose={handlePreferencesClick} />
        <Share isOpen={showShare} onClose={handleShareClick} />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
