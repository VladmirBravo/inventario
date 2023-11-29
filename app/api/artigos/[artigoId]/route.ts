import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
    req: Request,
    { params }: { params: { artigoId: string }}
) {
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Sem Autenticação do Usuario", { status: 401 });
          }
          

        const artigos = await prismadb.inventario.findMany({
            where: {
                armazem: params.artigoId
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
        
        return NextResponse.json(artigos)
    } catch (error) {
        console.log('[CATEGORIA_GET]',  error);
        return new NextResponse("Erro Interno", { status: 500 });
    }
};