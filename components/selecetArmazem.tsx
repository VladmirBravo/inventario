"use client"
import * as React from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import BotaoNext from "@/app/(root)/components/botao";
import { ArtigosProps } from "@/app/(root)/page";
import { Heading } from "./ui/heading";

interface SelectArmazemProps {
  initialData: string[];
}

export const SelectArmazem: React.FC<SelectArmazemProps> = ({initialData}) => {
  
  const armazem = initialData;
  
  const [valorSelecionado, setValorSelecionado] = useState('Selecione o Armazem');
  const [artigosTipos, setArtigosTipos] = useState<ArtigosProps[]>([]);

  let armazens: any = ''
  const handleSelecao = (event: any) => {
    armazens = event
    setValorSelecionado(armazens);
    //console.log(armazens)
    artigosArmazem()
  };
  
  
  const artigosArmazem = async () => {
   const validar = await axios.get(`/api/artigos/${armazens}`);
   //const validar = await ConsultarArtigos(armazens)
   const dados = validar.data.map((item: any, index: any)  => ({
     data: {
       artigo: item.artigo,
       localizacao: item.localizacao,
       unidade: item.unidade,
       quantidade: item.quantidade,
       descriArtigo: item.descriArtigo,
       armazem: item.armazem
      },
    }));
    setArtigosTipos(dados)
  }
  
  return (
    <>
     <div className="flex-1 space-y-4 p-8 pt-2">
        <Heading
          titulo={`Armazem - ${valorSelecionado}`}
          descricao={``}
        />
      </div>
      <Select onValueChange={handleSelecao}>
        <SelectTrigger className="w-[190px]" >
          <SelectValue placeholder="Selecione o Armazem" />
        </SelectTrigger>
        <SelectContent >
          <SelectGroup>
            <SelectLabel>Armazens</SelectLabel>
            {armazem.map((valor, index) => (
              <SelectItem value={valor} key={index}>
                {valor}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <BotaoNext data={artigosTipos} />
    </>
  );
};


export default SelectArmazem;
