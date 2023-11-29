"use server"
import prisma from '@/prisma/db'

const ConsultarArtigos =async (armazem: string) => {

    const artigos = await prisma.inventario.findMany({
        where: {
            armazem: armazem
        },
        select: {
          artigo: true,
          localizacao: true,
          unidade: true,
          quantidade: true,
          descriArtigo: true,
          armazem: true,
        },
        distinct: ["artigo"],
      });

      return artigos
    
}

export default ConsultarArtigos