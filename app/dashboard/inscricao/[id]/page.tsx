import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { InscricaoDetail } from "@/components/inscricao-detail"
import type { Inscricao } from "@/lib/types"

export default async function InscricaoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("inscricoes")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    notFound()
  }

  return <InscricaoDetail inscricao={data as Inscricao} />
}
