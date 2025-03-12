import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ModalVerDetalhes from "@/components/verDetalhes";
import { useRotulos } from "@/hook/getRotulos";
import { useState } from "react";


interface Props { }

interface Rotulo {
    ID_ROTULO: number;
    CODPROD: number;
    DESCRPROD: string;
    STATUS2: string;
    ABERTOPDI: string;
    DATA_FINALIZACAO: string;
    DATA_CRIACAO: string;
}

const Portfolio: React.FC<Props> = () => {
    const { data: rotulos } = useRotulos();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [idClick, setIdClick] = useState<number | null>(null);

    const [modalDetails, setModalDetails] = useState<boolean>(false);
    const onClose = () => {
        setModalDetails(false);
    };

    const filteredRotulos = (rotulos || []).filter((rotulo: Rotulo) =>
        rotulo.CODPROD.toString().includes(searchQuery) ||
        rotulo.DESCRPROD.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rotulo.DATA_FINALIZACAO && rotulo.DATA_FINALIZACAO.includes(searchQuery)));

    return (
        <>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2 mb-7">
                    <h2 className="text-3xl font-bold tracking-tight ">Portfólio Rótulos</h2>
                </div>

                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[180px] h-[5vh] px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
                    />
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-12">
                    {filteredRotulos.map((rotulo: Rotulo) => (
                        <Card
                            key={rotulo.ID_ROTULO}
                            onClick={() => {
                                setModalDetails(true);
                                setIdClick(rotulo.ID_ROTULO);
                            }}
                            className="border transition-all transform hover:scale-105 hover:shadow-2xl duration-300"
                        >
                            <CardHeader className="rounded-t-xl p-4  ">
                                <p className="text-lg font-bold mt-1 uppercase">{rotulo.DESCRPROD}</p>
                                <p className="text-sm font-semibold">
                                    Código do Rótulo:
                                    <span className=" font-bold ml-1">{rotulo.CODPROD}</span>
                                </p>
                                {rotulo.DATA_CRIACAO && (
                                    <p className="text-sm font-semibold">
                                        Dt. Criação:
                                        <span className=" font-bold ml-1">{rotulo.DATA_CRIACAO}</span>
                                    </p>
                                )}
                                {rotulo.DATA_FINALIZACAO && (
                                    <p className="text-sm font-semibold">
                                        Dt. Finalização:
                                        <span className=" font-bold ml-1">{rotulo.DATA_FINALIZACAO}</span>
                                    </p>
                                )}
                                {rotulo.ABERTOPDI === 'S' && (
                                    <span className="font-extralight text-[12px] ">Rótulo aberto pelo PDI</span>
                                )}

                                <CardDescription
                                    className={`mt-2 text-sm font-medium ${rotulo.STATUS2.includes("Pendente de Avaliação")
                                        ? "text-yellow-600"
                                        : rotulo.STATUS2.includes("Enviado para Avalição")
                                            ? "text-blue-600"
                                            : rotulo.STATUS2.includes("Finalizada")
                                                ? "text-green-600"
                                                : rotulo.STATUS2.includes("Reprovado") ? "text-red-600"
                                                    : "text-grey-600"
                                        }`}
                                >
                                    {rotulo.STATUS2}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>

            {modalDetails && <ModalVerDetalhes open={modalDetails} onClose={onClose} idClick={idClick} />}

        </>
    )
}

export default Portfolio;