import { useSuspenseQuery } from "@tanstack/react-query";
import { webhookDetailsSchema } from "../http/schemas/webhooks";
import { WebhookDetailHeader } from "./webhook-detail-header";
import { SectionTitle } from "./section-title";
import { SectionDataTable } from "./section-data-table";
import { CodeBlock } from "./ui/code-block";

interface WebhookDetailsProps {
  id: string;
}

export function WebhookDetails({ id }: WebhookDetailsProps) {
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
      <WebhookDetailHeader
        method={data.method}
        pathname={data.pathname}
        ip={data.ip}
        createdAt={data.createdAt}
      />

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
