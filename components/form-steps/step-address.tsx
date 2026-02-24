"use client"

import type { UseFormReturn } from "react-hook-form"
import type { InscricaoFormData } from "@/lib/types"
import { estadosBrasil } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StepAddress({ form }: { form: UseFormReturn<InscricaoFormData> }) {
  const { register, formState: { errors }, setValue, watch } = form

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="endereco">
          Endereco <span className="text-destructive">*</span>
        </Label>
        <Input
          id="endereco"
          placeholder="Rua, numero, complemento"
          {...register("endereco")}
          aria-invalid={!!errors.endereco}
        />
        {errors.endereco && (
          <p className="text-sm text-destructive">{errors.endereco.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bairro">Bairro</Label>
        <Input
          id="bairro"
          placeholder="Nome do bairro"
          {...register("bairro")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cidade">
            Cidade <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cidade"
            placeholder="Nome da cidade"
            {...register("cidade")}
            aria-invalid={!!errors.cidade}
          />
          {errors.cidade && (
            <p className="text-sm text-destructive">{errors.cidade.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="estado">
            Estado <span className="text-destructive">*</span>
          </Label>
          <Select
            value={watch("estado")}
            onValueChange={(val) => setValue("estado", val, { shouldValidate: true })}
          >
            <SelectTrigger id="estado" aria-invalid={!!errors.estado}>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {estadosBrasil.map((uf) => (
                <SelectItem key={uf} value={uf}>
                  {uf}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.estado && (
            <p className="text-sm text-destructive">{errors.estado.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cep">CEP</Label>
        <Input
          id="cep"
          placeholder="00000-000"
          {...register("cep")}
        />
      </div>
    </div>
  )
}
