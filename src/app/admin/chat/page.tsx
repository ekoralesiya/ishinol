import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader, EmptyState } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ChatPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let sessions: Array<{
    id: string;
    visitorName: string | null;
    email: string | null;
    status: string;
    createdAt: Date;
    messages: Array<{ id: string; sender: string; body: string; createdAt: Date }>;
  }> = [];
  try {
    sessions = await prisma.chatSession.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  } catch {
    sessions = [];
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader
        title="Chat"
        description="Visitor chat sessions (read-only). Real-time replies are planned via polling/WebSocket."
      />

      {sessions.length === 0 ? (
        <EmptyState message="No chat sessions yet." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {sessions.map((s) => (
            <Card key={s.id}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="size-4 text-gold-700" />
                  {s.visitorName ?? "Anonymous visitor"}
                </CardTitle>
                <Badge variant={s.status === "open" ? "success" : "muted"}>{s.status}</Badge>
              </CardHeader>
              <CardContent>
                {s.email && <p className="mb-2 text-xs text-muted-foreground">{s.email}</p>}
                <div className="max-h-56 space-y-2 overflow-y-auto rounded-md bg-muted/40 p-3">
                  {s.messages.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No messages.</p>
                  ) : (
                    s.messages.map((m) => (
                      <div
                        key={m.id}
                        className={
                          m.sender === "admin"
                            ? "ml-8 rounded-md bg-gold/15 px-3 py-2 text-xs text-ink"
                            : "mr-8 rounded-md bg-white px-3 py-2 text-xs text-ink shadow-sm"
                        }
                      >
                        <p className="mb-0.5 font-medium capitalize text-muted-foreground">{m.sender}</p>
                        {m.body}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
