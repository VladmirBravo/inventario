"use client"

import * as z from "zod";
import { DataTable } from "@/components/ui/data-table";
import { PrismaClient } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import SelectArmazem from "@/components/selecetArmazem";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";


const prisma = new PrismaClient();

const formSchema = z.object({
  name: z.string().min(1, "Deve conter pelo menos uma letra"),
  painelId: z.string().min(1)
});

type CategoriaFormValues = z.infer<typeof formSchema>;

export  const InventarioFom = async () => {
  const data = await prisma.inventario.findMany({
    where: {
      armazem: "311",
    },
  });

  const form = useForm<CategoriaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        painelId: '',
    }
});

const onSubmit = async (data: CategoriaFormValues) => {
    try {
        
       
    } catch (error) {
        
    } finally {
        
    }
};

  return (
    <>
     <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input  placeholder="Nome da Categoria" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="painelId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Painel</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Selecione um Painel"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {/* {paineis.map((painel) => (
                                                <SelectItem
                                                key={painel.id}
                                                value={painel.id}
                                                >
                                                    {painel.label}
                                                </SelectItem>
                                            ))} */}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button className="ml-auto" type="submit">
                        
                    </Button>
                </form>
            </Form>
    </>
  );
}
