"use client"

import { ColumnDef } from "@tanstack/react-table"

export type InvetarioColumn = {
  descriArtigo: string
  unidadeBase: string
  quantidade: string
  localizacao: string
  armazem: string
}

export const columns: ColumnDef<InvetarioColumn>[] = [
  {
    accessorKey: "descriArtigo",
    header: "Artigo",
  },
  {
    accessorKey: "armazem",
    header: "Armazem",
  },
  {
    accessorKey: "unidadeBase",
    header: "Unidade Base",
  },
  {
    accessorKey: "localizacao",
    header: "Localização",
  },
  {
    accessorKey: "quantidade",
    header: "Quantidade",
  },
]
