"use client"

import type { UseFormReturn } from "react-hook-form"
import type { InscricaoFormData } from "@/lib/types"
import { generoOptions } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StepPersonalData({ form }: { form: UseFormReturn<InscricaoFormData> }) {
  const { register, formState: { errors }, setValue, watch } = form

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome_completo">
          Nome Completo <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nome_completo"
          placeholder="Nome completo do inscrito"
          {...register("nome_completo")}
          aria-invalid={!!errors.nome_completo}
        />
        {errors.nome_completo && (
          <p className="text-sm text-destructive">{errors.nome_completo.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="data_nascimento">
            Data de Nascimento <span className="text-destructive">*</span>
          </Label>
          <Input
            id="data_nascimento"
            type="date"
            {...register("data_nascimento")}
            aria-invalid={!!errors.data_nascimento}
          />
          {errors.data_nascimento && (
            <p className="text-sm text-destructive">{errors.data_nascimento.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="genero">
            Genero <span className="text-destructive">*</span>
          </Label>
          <Select
            value={watch("genero")}
            onValueChange={(val) => setValue("genero", val, { shouldValidate: true })}
          >
            <SelectTrigger id="genero" aria-invalid={!!errors.genero}>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {generoOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.genero && (
            <p className="text-sm text-destructive">{errors.genero.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            {...register("cpf")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="rg">RG</Label>
          <Input
            id="rg"
            placeholder="Numero do RG"
            {...register("rg")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="telefone">Telefone</Label>
        <Input
          id="telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          {...register("telefone")}
        />
      </div>
    </div>
  )
}
