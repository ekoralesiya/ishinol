import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { can, roleLabel } from "@/lib/rbac";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader, EmptyState } from "@/components/admin/page-header";
import { ActionForm } from "@/components/admin/action-form";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createUser } from "@/app/admin/actions";
import type { Role } from "@prisma/client";

export default async function UsersPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const canRead = can(session.user.role, "users:read");
  const canWrite = can(session.user.role, "users:write");

  let users: Array<{
    id: string;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    lastLoginAt: Date | null;
  }> = [];
  if (canRead) {
    try {
      users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    } catch {
      users = [];
    }
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader title="Users" description="Manage admin accounts and roles." />

      {!canRead ? (
        <EmptyState message="Insufficient permission — your role cannot view users." />
      ) : (
        <>
          {canWrite ? (
            <Card className="mb-6">
              <CardHeader><CardTitle>Create user</CardTitle></CardHeader>
              <CardContent>
                <ActionForm action={createUser} resetOnSuccess successMessage="User created.">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" minLength={6} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="role">Role</Label>
                      <select id="role" name="role" defaultValue="EDITOR"
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="EDITOR">Editor</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </div>
                  </div>
                  <Button type="submit" variant="gold">Create user</Button>
                </ActionForm>
              </CardContent>
            </Card>
          ) : (
            <p className="mb-6 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
              You can view users but cannot create or modify them (insufficient permission).
            </p>
          )}

          {users.length === 0 ? (
            <EmptyState message="No users found." />
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-5 py-3 font-medium">User</th>
                        <th className="px-5 py-3 font-medium">Role</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        {canWrite && <th className="px-5 py-3 text-right font-medium">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-border last:border-0">
                          <td className="px-5 py-3">
                            <p className="font-medium text-ink">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </td>
                          <td className="px-5 py-3"><Badge variant="gold">{roleLabel(u.role)}</Badge></td>
                          <td className="px-5 py-3">
                            <Badge variant={u.isActive ? "success" : "muted"}>
                              {u.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          {canWrite && (
                            <td className="px-5 py-3">
                              <UserRowActions
                                id={u.id}
                                role={u.role}
                                isActive={u.isActive}
                                isSelf={u.id === session.user.id}
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </AdminShell>
  );
}
