import { useQuery } from "@tanstack/react-query";

const fetchFormula = async (idClick?: number | null) => {
    const response = await JX.consultar(
        `SELECT 
        FORMULA, 
        FORMAT(DATA, 'dd/MM/yyyy HH:mm') AS DATA, 
        CODUSU, 
        OBS 
        FROM AD_ROTULOSPDI 
        WHERE ID_ROTULO = ${idClick}`
    );
    return response[0];
};

export function useGetFormula(idClick?: number | null) {
    return useQuery({
        queryKey: ["formula", idClick],
        queryFn: () => fetchFormula(idClick),
        retry: false,
        enabled: !!idClick,
    });
}
