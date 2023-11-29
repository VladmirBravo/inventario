

import { DataTable } from "@/components/ui/data-table";
import { PrismaClient } from "@prisma/client";
import { InvetarioColumn, columns } from "./components/columns";

import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs";
import SelectArmazem from "@/components/selecetArmazem";

export type ArtigosProps = {
  data: {
    artigo: string;
    localizacao: string;
    unidade: string;
    quantidade: string;
    descriArtigo: string;
    armazem: string;
  }
};

const prisma = new PrismaClient();

export default async function Home() {
  const { userId } = auth();
  
  //CONSULTA DE ARMAZENS DISPONIVEIS PARA O USUARIO --- FALTA COLOCAR A TABELA USER ARMAZEM EM VEM DE INVENTARIO
  const arma = await prisma.inventario.findMany({
    select: {
      armazem: true
    },

    distinct: ["armazem"],
  });

   const valoresArmazem = arma.map(item => item.armazem);

  // CONSULTA DOS ARTIGOS INVENTARIADOS POR USUARIO
  const data = await prisma.userInventario.findMany({
    where: {
      userId: userId?.toString(),
      inventariocontagens:{
        recontagem: true
      }
    },
    include: {
      inventariocontagens: true,
    },
    orderBy: {
      createdAt: 'desc'
  }
  });

  const formatarArtigos: InvetarioColumn[] = data.map((item) => ({
    descriArtigo: item.inventariocontagens.descriArtigo,
    localizacao: item.inventariocontagens.localizacao,
    unidadeBase: item.inventariocontagens.unidadeBase,
    quantidade: item.inventariocontagens.quantidade,
    armazem: item.inventariocontagens.armazem
  }));

  const user = await currentUser();
  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <p>{user?.emailAddresses[0].emailAddress}</p>

      <div className="flex col"></div>
      <div className="flex-1 space-y-4 p-8 pt-2">
        {/* <BotaoNext data={artigosTipos} /> */}
        <SelectArmazem initialData={valoresArmazem} />
        <DataTable
          searchKey="descriArtigo"
          columns={columns}
          data={formatarArtigos}
        />
      </div>
    </>
  );
}

// const artigos = await prisma.inventario.findMany({
//   select: {
//     artigo: true,
//     localizacao: true,
//     unidade: true,
//     quantidade: true,
//     descriArtigo: true,
//   },
//   distinct: ["artigo"],
// });

// const artigosTipos: ArtigosProps[] = artigos.map((item) => ({
//   data: {
//     artigo: item.artigo,
//     localizacao: item.localizacao,
//     unidade: item.unidade,
//     quantidade: item.quantidade,
//     descriArtigo: item.descriArtigo
//   },
// }));