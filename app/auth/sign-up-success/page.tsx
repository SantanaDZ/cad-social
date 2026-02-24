import Link from "next/link"
import { ShieldCheck, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-8">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <ShieldCheck className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground">CadSocial</span>
      </Link>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <MailCheck className="h-8 w-8 text-success" />
          </div>
          <CardTitle className="text-2xl">Conta criada!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            Enviamos um email de confirmacao. Verifique sua caixa de entrada e clique no link para ativar sua conta.
          </p>
          <Link href="/auth/login">
            <Button className="w-full" size="lg">
              Ir para Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
