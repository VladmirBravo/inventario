"use client"

import DialogCaller from "@/components/dialogCaller";
import { ArtigosProps } from "../page";

export interface BotaoNome {
    data: ArtigosProps[];
}

const BotaoNext: React.FC<BotaoNome> = ({
   data
}) => {
    
    return(
        <DialogCaller data={data}/>
    )
}

export default BotaoNext;