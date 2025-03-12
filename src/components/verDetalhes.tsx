import Formula from "./formula";
import LinhaTempo from "./linhaTempo";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useGetDetailsRot } from "@/hook/getDetailsRotulo";
import { useGetLinhaTempo } from "@/hook/getLinhaTempo";

interface Props {
    open: boolean;
    onClose: () => void;
    idClick: number | null;
}
const ModalVerDetalhes: React.FC<Props> = ({ open, onClose, idClick }) => {
    const { data: rotulo } = useGetDetailsRot(idClick);
    const { data: linha_tempo, isError, isLoading} = useGetLinhaTempo(idClick);


    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-[50%] max-h-[80vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Processo</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="max-h-[60vh] overflow-y-auto p-2">
                        <div className="flex flex-col gap-2">
                            {rotulo ? (
                                <div key={rotulo.ID_ROTULO}>
                                    <p className="font-semibold mb-1">
                                        Rótulo: <span className="font-light">{rotulo.CODPROD} - {rotulo.DESCRPROD.trim()}</span>
                                    </p>
                                    <p className="font-semibold mb-1">
                                        Status: <span className="font-light">{rotulo.STATUS2}</span>
                                    </p>
                                    <p className="font-semibold mb-1">
                                        Data de Criação: <span className="font-light">{rotulo.DATA}</span>
                                    </p>

                                    <div className="flex gap-2 mb-5 mt-2">

                                        {rotulo.ABERTOPDI === 'S' && (
                                            <Formula idClick={idClick} />
                                        )}
                                    </div>

                                </div>
                            ) : null}
                        </div>


                        <div className="mt-2 p-2">
                            {isLoading ? (
                                <p>Carregando...</p>
                            ) : isError ? (
                                <p>Ocorreu um erro ao carregar os dados.</p>
                            ) : (
                                <LinhaTempo
                                    idClick={idClick}
                                    linha_tempo={linha_tempo}
                                />
                            )}
                        </div>

                    </ScrollArea>

                    <DialogFooter>
                        <Button onClick={onClose}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ModalVerDetalhes;
