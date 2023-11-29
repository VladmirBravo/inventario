import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Inventario } from "@prisma/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { PrismaClient } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import React from "react";
import Select from "react-select";
import { ArtigosProps } from "@/app/(root)/page";

const prisma = new PrismaClient();

const formSchema = z.object({
  quantidade: z.optional(z.string()),
  localizacao: z.optional(z.string()),
  artigo: z.optional(z.string()),
  descriArtigo: z.optional(z.string()),
  unidade: z.optional(z.string()),
  uniadeBase: z.optional(z.string()),
  armazem: z.optional(z.string()),
  unidadeTrue: z.boolean().default(false),
  recontagem: z.boolean().default(false),
});

interface InventarioProps {
  data: ArtigosProps[];
}

type InvetariosFormValues = z.infer<typeof formSchema>;

export const DialogCaller: React.FC<InventarioProps> = ({ data }) => {
  const router = useRouter();
  let res: Inventario[] = [];
    
  const [artigoSelecionado, setartigoSelecionado] = useState(null);
  const [artigoParaConsulta, setArtigoParaConsulta] = useState()
  const [artigoDescrcao, setArtigoDescrcao] = useState()
  const [campoLocaliza, setcampoLocaliza] = useState('');
  const [campoQuantidade, setcampoQuantidade] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleChangeLocalizacao = (event: any) => {
    // Atualiza o estado com o novo valor do campo
    setcampoLocaliza(event.target.value);
  };
  const handleChangeQuantidade = (event: any) => {
    // Atualiza o estado com o novo valor do campo
    setcampoQuantidade(event.target.value);
  };
  const handleCheckboxChange = () => {
    // Inverte o estado do checkbox
    setIsChecked(!isChecked);
  };
  const handleSelectChange = (opcao: any) => {
    // Atualize o estado com a opção selecionada
    setartigoSelecionado(opcao)
    setArtigoParaConsulta(opcao.value)
    setArtigoDescrcao(opcao.label)
  };

  
  const options = data.map((item) => ({
    value: item.data.artigo,
    label: item.data.descriArtigo,
  }));

  const armazem = data.map((item) => ({
    value: item.data.armazem,
  }));


  const form = useForm<InvetariosFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantidade: "",
      localizacao: "",
      armazem: "",
      unidadeTrue: false
    },
  });

  const apagarColumns = () => {
    setartigoSelecionado(null)
    setArtigoParaConsulta(undefined)
    setcampoLocaliza('')
    setcampoQuantidade('')
    setIsChecked(false);
  }

  const dados = { data };
  const onSubmit = async (data: InvetariosFormValues) => {
   // console.log(artigoParaConsulta)
    data.unidadeTrue = isChecked
    if(data.unidadeTrue == false){
      alert('Confirme a Uniade do Artigo')
    }
    
    if (artigoParaConsulta == undefined || "") {
      alert('Selecione Um artigo')
      return
    }
    if (campoQuantidade == "") {
      alert('Digite a Quantidade')
      return
    }
    if ( campoLocaliza == "") {
      alert('Digite a Localização')
      return
    }

    
    data.artigo = artigoParaConsulta;
    data.descriArtigo = artigoDescrcao;
    data.unidade = dados.data[0].data.unidade;
    data.unidade = dados.data[0].data.unidade;
    data.localizacao = campoLocaliza;
    data.quantidade = campoQuantidade;
    data.armazem = armazem[0]?.value;
    data.recontagem = true;
    try {
     const validar = await axios.patch(`/api/artigos/`, data);
    // console.log(validar.data)
     if(validar.data == 'Negado')
     {
      if (confirm('Esse artigo já foi contado para esta localização, Pretende actualizar a quantidade?')) {
        // Save it!
        data.recontagem = false;
        await axios.patch(`/api/artigos/`, data);
        router.refresh();
        apagarColumns();
        alert("Artigo Recontado");
      } else {
        // Do nothing!
        console.log('Thing was not saved to the database.');
      }
      return 
     }
      alert("sucesso");
      router.refresh();
      apagarColumns();
    } catch (error) {
      alert("Deu algum erro");
    } finally {
    }
  };

  return (
    
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar Contagem</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Validar Artigo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid grid-cols-1 items-center gap-2">
              <FormField
                control={form.control}
                name="artigo"
                disabled={true}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">Artigo</FormLabel>
                    <FormControl>
                      <Select
                        value={artigoSelecionado}
                        onChange={handleSelectChange}
                        options={options}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-2">
              <FormField
                control={form.control}
                name="localizacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right">Localização</FormLabel>
                    <FormControl>
                      <Input {...field}  value={campoLocaliza} onChange={handleChangeLocalizacao} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <FormField
                control={form.control}
                name="unidadeTrue"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                      checked={isChecked} 
                      onCheckedChange={handleCheckboxChange}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Confirmar a Unidade Base
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-4">
              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >Unidade de Contagem</FormLabel>
                    <FormControl>
                      <Input type="number" value={campoQuantidade} onChange={handleChangeQuantidade} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Salvar Contagem</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCaller;

// const PegarArtigo = async () => {
//   //setArtigosObject(await getArtigos(artigo));
//   try {
//     res = await axios.get(`/api/artigos/${artigo}`);
//   } catch (error) {
//   } finally {
//   }

//   const artigoConsu = Object.entries(res);
//   setDescricao(artigoConsu[0][1]?.descricao);
//   setLote(artigoConsu[0][1]?.lote);
//   setLocalizacao(artigoConsu[0][1]?.localizacao);
//   setUnidade(artigoConsu[0][1]?.unidade);
// };
