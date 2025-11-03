import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <h3 className="text-lg font-semibold">No webhooks selected</h3>
        <p>Select a webhook from the list to see the details</p>
      </div>
    </div>
  );
}
