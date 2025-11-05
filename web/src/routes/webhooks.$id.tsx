import { createFileRoute } from "@tanstack/react-router";
import { WebhookDetailHeader } from "../components/webhook-detail-header";
import { SectionTitle } from "../components/section-title";
import { SectionDataTable } from "../components/section-data-table";
import { CodeBlock } from "../components/ui/code-block";
import { useSuspenseQuery } from "@tanstack/react-query";
import { webhookDetailsSchema } from "../http/schemas/webhooks";

export const Route = createFileRoute("/webhooks/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const { data } = useSuspenseQuery({
    queryKey: ["webhooks", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/api/webhooks/${id}`);
      const data = await response.json();
      return webhookDetailsSchema.parse(data);
    },
  });

  const overviewData = [
    {
      key: "Method",
      value: data.method,
    },
    {
      key: "Status Code",
      value: data.statusCode.toString(),
    },
    {
      key: "Content-type",
      value: data.contentType ?? "application/json",
    },
    {
      key: "Content-length",
      value: `${data.contentLength ?? 0} bytes`,
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
