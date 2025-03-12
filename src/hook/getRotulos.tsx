import { useQuery } from "@tanstack/react-query";

interface IResponse {
    ID_ROTULO: number;
    OBS: string;
    CODPROD: number;
    DESCRPROD: string;
    STATUS: string;
    STATUS2: string;
    ABERTOPDI: string;
    DATA_FINALIZACAO: string;
    DATA_CRIACAO: string
}

const fetchRotulos = async (): Promise<IResponse[]> => {
    const response = await JX.consultar(`
        SELECT ID_ROTULO, 
        FORMAT(ROT.DATA_CRIACAO, 'dd/MM/yyyy HH:mm') AS DATA_CRIACAO, 
        ROT.ABERTOPDI, 
        ROT.CODPROD, 
        PRO.DESCRPROD, 
        FORMAT(ROT.DATA_FINALIZACAO, 'dd/MM/yyyy HH:mm') AS DATA_FINALIZACAO, 
        SANKHYA.OPTION_LABEL('AD_ROTULOS', 'STATUS', ROT.STATUS) AS STATUS2 
        FROM AD_ROTULOS AS ROT 
        INNER JOIN TGFPRO PRO ON PRO.CODPROD = ROT.CODPROD 
        WHERE STATUS = 'FINALIZADA' 
        ORDER BY DATA_FINALIZACAO DESC`
    );
    return response;
};


export const useRotulos = () => {
    return useQuery<IResponse[], Error>({
        queryKey: ["rotulos"],
        queryFn: fetchRotulos,
        retry: false,
    });
};
