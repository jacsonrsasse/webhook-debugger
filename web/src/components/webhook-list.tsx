import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { WebhookListItem } from "./webhook-list-item";
import { webhookListSchema } from "../http/schemas/webhooks";
import { Loader2, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CodeBlock } from "./ui/code-block";

export function WebhookList() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const intersectionRef = useRef<IntersectionObserver>(null);

  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([]);
  const [generatedHandlerCode, setGeneratedHandlerCode] = useState<
    string | null
  >(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["webhooks"],
      queryFn: async ({ pageParam }) => {
        const url = new URL("http://localhost:3333/api/webhooks");
        pageParam && url.searchParams.set("cursor", pageParam);
        const response = await fetch(url);
        const data = await response.json();
        return webhookListSchema.parse(data);
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialPageParam: undefined as string | undefined,
    });

  const webhooks = data.pages.flatMap((item) => item.webhooks);

  useEffect(() => {
    if (intersectionRef.current) {
      intersectionRef.current.disconnect();
    }

    intersectionRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      intersectionRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (intersectionRef.current) {
        intersectionRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function handleWebhookChecked(checkedId: string) {
    if (checkedWebhooksIds.includes(checkedId)) {
      setCheckedWebhooksIds((prev) => prev.filter((id) => id !== checkedId));
    } else {
      setCheckedWebhooksIds((prev) => [...prev, checkedId]);
    }
  }

  async function handleGenerateHandler() {
    const response = await fetch("http://localhost:3333/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ webhookIds: checkedWebhooksIds }),
    });

    type GenerateHandlerResponse = {
      code: string;
    };

    const data: GenerateHandlerResponse = await response.json();
    setGeneratedHandlerCode(data.code);
  }

  const hasCheckedWebhooks = checkedWebhooksIds.length > 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          <button
            disabled={!hasCheckedWebhooks}
            className="bg-indigo-400 mb-3 text-white rounded-lg w-full flex items-center justify-center gap-3 font-medium text-sm py-2.5 disabled:opacity-50"
            onClick={() => handleGenerateHandler()}
          >
            <Wand2 className="size-4" />
            Gerar Handler
          </button>

          {webhooks.map((item) => (
            <WebhookListItem
              key={item.id}
              webhook={item}
              isWebhookChecked={checkedWebhooksIds.includes(item.id)}
              onWebhookChecked={handleWebhookChecked}
            />
          ))}
        </div>

        {hasNextPage && (
          <div className="p-2" ref={loadMoreRef}>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="size-5 animate-spin text-zinc-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {generatedHandlerCode && (
        <Dialog.Root defaultOpen={true}>
          <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20">
            <Dialog.Content className="flex items-center justify-center fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 z-40">
              <div className="bg-zinc-900 w-[600px] p-4 rounded-lg border border-zinc-800 max-h-[400px] overflow-auto">
                <CodeBlock language="typescript" code={generatedHandlerCode} />
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Root>
      )}
    </>
  );
}
