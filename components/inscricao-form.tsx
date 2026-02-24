"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Loader2, Check, User, MapPin, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { inscricaoSchema, type InscricaoFormData, step1Fields, step2Fields, step3Fields } from "@/lib/types"
import { StepPersonalData } from "@/components/form-steps/step-personal-data"
import { StepAddress } from "@/components/form-steps/step-address"
import { StepSocioeconomic } from "@/components/form-steps/step-socioeconomic"
import { useOfflineQueue, useOnlineStatus } from "@/hooks/use-offline-queue"

const steps = [
  { title: "Dados Pessoais", description: "Informações básicas do inscrito", icon: User, fields: step1Fields },
  { title: "Endereço", description: "Localização e moradia", icon: MapPin, fields: step2Fields },
  { title: "Dados Socioeconômicos", description: "Situação social e financeira", icon: BarChart3, fields: step3Fields },
]

export function InscricaoForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const isOnline = useOnlineStatus()
  const { addToQueue } = useOfflineQueue()

  const form = useForm<InscricaoFormData>({
    resolver: zodResolver(inscricaoSchema),
    defaultValues: {
      nome_completo: "",
      data_nascimento: "",
      genero: "",
      cpf: "",
      rg: "",
      telefone: "",
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      renda_familiar: undefined,
      membros_familia: undefined,
      despesas_mensais: undefined,
      escolaridade: "",
      situacao_moradia: "",
      possui_beneficio_gov: false,
      qual_beneficio: "",
      observacoes: "",
    },
    mode: "onTouched",
  })

  async function goNext() {
    const fields = steps[currentStep].fields as readonly string[]
    const valid = await form.trigger(fields as (keyof InscricaoFormData)[])
    if (valid && currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
    }
  }

  async function onSubmit(data: InscricaoFormData) {
    setSubmitting(true)

    if (!isOnline) {
      addToQueue(data as unknown as Record<string, unknown>)
      toast.info("Você está offline", {
        description: "A inscrição foi salva localmente e será enviada quando a conexão voltar.",
      })
      router.push("/dashboard")
      return
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Sessão expirada. Faça login novamente.")
        router.push("/auth/login")
        return
      }

      const { error } = await supabase.from("inscricoes").insert({
        ...data,
        user_id: user.id,
        status: "pendente",
      })

      if (error) {
        toast.error("Erro ao salvar inscrição", { description: error.message })
        setSubmitting(false)
        return
      }

      toast.success("Inscrição salva com sucesso!")
      router.push("/dashboard")
      router.refresh()
    } catch {
      toast.error("Erro inesperado ao salvar")
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const StepIcon = step.icon
            const isActive = idx === currentStep
            const isDone = idx < currentStep
            return (
              <div key={step.title} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${isDone
                        ? "border-success bg-success text-success-foreground"
                        : isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                  >
                    {isDone ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-center text-xs font-medium ${isActive ? "text-primary" : isDone ? "text-success" : "text-muted-foreground"
                      }`}
                  >
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">Passo {idx + 1}</span>
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${idx < currentStep ? "bg-success" : "bg-border"
                      }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form card */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 0 && <StepPersonalData form={form} />}
            {currentStep === 1 && <StepAddress form={form} />}
            {currentStep === 2 && <StepSocioeconomic form={form} />}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={goNext} className="gap-2">
                  Próximo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={submitting} className="gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Salvar Inscrição
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
