import { Button } from "./ui/button";
import { getUsuLog } from "@/utils/usuarioLogado";
import { getCurrentDate } from "@/utils/nowDate";

interface LinhaTempo {
    ID_ATIVIDADE: number;
    OBS: string;
    STATUS: string;
    STATUS2: string;
    DATA_FORMATADA: string;
    JUSTIFICATIVA: string;
    CHECKLISTREALIZADO: string;
    NOMEUSU: string;
}

interface Props {
    idClick: number | null;
    linha_tempo: LinhaTempo[];
}

const LinhaTempo: React.FC<Props> = ({ idClick, linha_tempo }) => {
    const codUsu = getUsuLog();
    const dataAtual = getCurrentDate();

    if (!linha_tempo || linha_tempo.length === 0) {
        return <></>;
    }

    const salvaLog = async (idAtividade: number) => {

        const responseNomeUsu = await JX.consultar(
            "SELECT NOMEUSU FROM TSIUSU USU WHERE USU.CODUSU = SANKHYA.STP_GET_CODUSULOGADO()"
        );
        const nomeUsu = responseNomeUsu[0]?.NOMEUSU;

        const response = await JX.consultar(`
            SELECT LOG_BAIXA_PORTFOLIO FROM AD_ROTULOSATIVIDADE WHERE ID_ROTULO = ${idClick} AND ID_ATIVIDADE = ${idAtividade}
        `)

        const logAtual = response[0]?.LOG_BAIXA_PORTFOLIO;
        let novoLog;
        if (logAtual) {
            novoLog = `${logAtual} (${codUsu} - ${nomeUsu} BAIXOU O PORTFÓLIO NA DATA: ${dataAtual});`;
        } else {
            novoLog = `(${codUsu} - ${nomeUsu} BAIXOU O PORTFÓLIO NA DATA - ${dataAtual});`;
        }
        console.log("log atual:", logAtual);
        if (idClick && idAtividade) {
            JX.salvar(
                { LOG_BAIXA_PORTFOLIO: novoLog },
                "AD_ROTULOSATIVIDADE",
                [{ ID_ROTULO: idClick, ID_ATIVIDADE: idAtividade }]
            ).then(() => {
                console.log("Log salvo com sucesso!");
            });
        }


    }

    const handleBaixaAnexo = async (idAtividade: number) => {
        try {
            const response = await JX.consultar(`
                SELECT ANEXO FROM AD_ROTULOSATIVIDADE 
                WHERE ID_ROTULO = ${idClick} AND ID_ATIVIDADE = ${idAtividade}`);

            const anexos = response[0]?.ANEXO;
            if (anexos) {
                const url = `${window.location.origin}/mge/AD_ROTULOSATIVIDADE@ANEXO@ID_ROTULO=${idClick}@ID_ATIVIDADE=${idAtividade}.dbimage`;

                const downloadResponse = await fetch(url);
                if (!downloadResponse.ok) {
                    throw new Error('Falha ao baixar o arquivo');
                }

                const blob = await downloadResponse.blob();
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `rotulo_${idClick}_${idAtividade}`;
                link.click();
                salvaLog(idAtividade)
            } else {
                console.error("Não foi encontrado o anexo para essa atividade.");
            }

        } catch (error) {
            console.error("Erro ao baixar anexo", error);
        }
    };




    return (
        <>
            <ol className="relative border-s border-gray-500 ">
                {linha_tempo.map((item: LinhaTempo) => {
                    return (
                        <li key={item.ID_ATIVIDADE} className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-500 rounded-full mt-1.5 -start-1.5 border border-white "></div>
                            <time className="mb-1 text-sm font-normal text-gray-400 dark:text-gray-500">{item.DATA_FORMATADA} - {item.NOMEUSU}</time>
                            <h3 className="text-lg font-semibold text-gray-900 dark:!text-white">Portfólio Final</h3>

                            <div className="mt-2">
                                <Button onClick={() => handleBaixaAnexo(item.ID_ATIVIDADE)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-400 rounded-lg hover:bg-gray-100">
                                    <svg className="w-3.5 h-3.5 me-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                                        <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                                    </svg>
                                    Baixar Anexo
                                </Button>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </>
    );
};

export default LinhaTempo;
