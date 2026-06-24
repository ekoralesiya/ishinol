import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-marble to-marble-200 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-ink text-xl font-bold tracking-tight text-gold">
            IS
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">ISHINOL Indonesia</h1>
          <p className="mt-1 text-sm text-muted-foreground">Content Management System</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <h2 className="text-lg font-semibold text-ink">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the admin panel.
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ISHINOL Indonesia — authorized personnel only.
        </p>
      </div>
    </div>
  );
}
