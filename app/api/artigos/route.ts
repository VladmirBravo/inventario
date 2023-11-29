import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const {
      artigo,
      quantidade,
      localizacao,
      unidadeTrue,
      descriArtigo,
      unidade,
      armazem,
      recontagem
    } = body;

    // if (!userId) {
    //   return new NextResponse("Sem Autenticação do Usuario", { status: 401 });
    // }

    if (!quantidade) {
      return new NextResponse("É Necessario um Nome", { status: 400 });
    }

    if (!localizacao) {
      return new NextResponse("È Necessario Preço", { status: 400 });
    }
    if (!artigo) {
      return new NextResponse("È Necessario Preço", { status: 400 });
    }
    if (!unidadeTrue) {
      return new NextResponse("È Necessario Preço", { status: 400 });
    } 
    //VALIDA SE O ARTIGO JÁ FOI CONTADO NA LOCALIZAÇÃO INDICADA
    const valor = await prismadb.inventarioContagens.findFirst({
      where: {
        localizacao: localizacao,
        artigo,
      },
    });
    if (valor != null && recontagem == true) {
      return new NextResponse("Negado", { status: 200 });
    }

    if (recontagem == false) {
      const artigoId = await prismadb.inventarioContagens.aggregate({
        _max: {
          id: true,
        },
        where: {
          artigo,
          localizacao
        },
      });

      await prismadb.inventarioContagens.updateMany({
        where: {
          artigo,
          localizacao,
          id: artigoId?._max.id || 0
        },
        data: {
          recontagem: false
        },
      });
    }


    await prismadb.inventarioContagens.create({
      data: {
        artigo,
        armazem,
        quantidade,
        localizacao,
        descriArtigo,
        unidade,
        recontagem: true,
        unidadeBase: unidade,
      },
    });

    await prismadb.inventarioContagens.updateMany({
      where: {
        artigo,
        localizacao,
      },
      data: {},
    });

    const artigoId = await prismadb.inventarioContagens.aggregate({
      _max: {
        id: true,
      },
      where: {
        artigo,
      },
    });

    const teste = await prismadb.userInventario.create({
      data: {
        userId: userId?.toString() || "",
        artigoId: artigoId?._max.id || 0,
        armazem: localizacao,
      },
    });

    return NextResponse.json(teste);
  } catch (error) {
    console.log("[PRODUTO_PATCH]", error);
    return new NextResponse("Erro Interno", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    //console.log('ENTREI')
    const categoria = await prismadb.inventario.findMany({
      where: {},
    });

    return NextResponse.json(categoria);
  } catch (error) {
    console.log("[CATEGORIA_GET]", error);
    return new NextResponse("Erro Interno", { status: 500 });
  }
}
