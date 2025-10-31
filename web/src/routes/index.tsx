import { createFileRoute } from "@tanstack/react-router";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="h-screen bg-zync-900">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15} maxSize={40}></Panel>
        <PanelResizeHandle className="w-px bg-zync-700 hover:bg-zync-600 transition-colors duration-150" />
        <Panel defaultSize={80} minSize={60}></Panel>
      </PanelGroup>
    </div>
  );
}
