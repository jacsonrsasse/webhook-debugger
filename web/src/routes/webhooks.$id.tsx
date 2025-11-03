import { createFileRoute } from "@tanstack/react-router";
import { WebhookDetailHeader } from "../components/webhook-detail-header";
import { SectionTitle } from "../components/section-title";
import { SectionDataTable } from "../components/section-data-table";
import { CodeBlock } from "../components/ui/code-block";

export const Route = createFileRoute("/webhooks/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const overviewData = [
    {
      key: "Method",
      value: "POST",
    },
    {
      key: "Status Code",
      value: "200",
    },
    {
      key: "Content-type",
      value: "application/json",
    },
    {
      key: "Content-length",
      value: "28794 bytes",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <WebhookDetailHeader />

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <SectionTitle>Request Overview</SectionTitle>
            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Query Parameters</SectionTitle>
            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Headers</SectionTitle>
            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Request Body</SectionTitle>
            <CodeBlock code={JSON.stringify(overviewData, null, 2)} />
          </div>
        </div>
      </div>
    </div>
  );
}
