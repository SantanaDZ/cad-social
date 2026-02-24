"use client"

import type { UseFormReturn } from "react-hook-form"
import type { InscricaoFormData } from "@/lib/types"
import { escolaridadeOptions, situacaoMoradiaOptions } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StepSocioeconomic({ form }: { form: UseFormReturn<InscricaoFormData> }) {
  const { register, formState: { errors }, setValue, watch } = form
  const possuiBeneficio = watch("possui_beneficio_gov")

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="renda_familiar">Renda Familiar (R$)</Label>
          <Input
            id="renda_familiar"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            {...register("renda_familiar")}
          />
          {errors.renda_familiar && (
            <p className="text-sm text-destructive">{errors.renda_familiar.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="membros_familia">Membros na Família</Label>
          <Input
            id="membros_familia"
            type="number"
            min="1"
            placeholder="Quantidade"
            {...register("membros_familia")}
          />
          {errors.membros_familia && (
            <p className="text-sm text-destructive">{errors.membros_familia.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="despesas_mensais">Despesas Mensais (R$)</Label>
        <Input
          id="despesas_mensais"
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          {...register("despesas_mensais")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="escolaridade">Escolaridade</Label>
          <Select
            value={watch("escolaridade") ?? ""}
            onValueChange={(val) => setValue("escolaridade", val)}
          >
            <SelectTrigger id="escolaridade">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {escolaridadeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="situacao_moradia">Situação de Moradia</Label>
          <Select
            value={watch("situacao_moradia") ?? ""}
            onValueChange={(val) => setValue("situacao_moradia", val)}
          >
            <SelectTrigger id="situacao_moradia">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {situacaoMoradiaOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="possui_beneficio_gov"
            checked={possuiBeneficio}
            onCheckedChange={(checked) =>
              setValue("possui_beneficio_gov", checked === true)
            }
          />
          <Label htmlFor="possui_beneficio_gov" className="cursor-pointer">
            Possui benefício governamental?
          </Label>
        </div>
        {possuiBeneficio && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="qual_beneficio">Qual benefício?</Label>
            <Input
              id="qual_beneficio"
              placeholder="Ex: Bolsa Família, BPC, etc."
              {...register("qual_beneficio")}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          placeholder="Informacoes adicionais relevantes..."
          rows={3}
          {...register("observacoes")}
        />
      </div>
    </div>
  )
}
