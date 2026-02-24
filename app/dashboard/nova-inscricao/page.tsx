import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InscricaoForm } from "@/components/inscricao-form"

export default function NovaInscricaoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground">Nova Inscricao</h1>
      </div>
      <InscricaoForm />
    </div>
  )
}
