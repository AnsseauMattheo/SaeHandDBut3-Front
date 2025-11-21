import {Dialog, DialogHeader} from "@/components/ui/dialog.jsx";
import {DialogContent, DialogTitle} from "@radix-ui/react-dialog";
import {Button} from "@/components/ui/button.jsx";


export default function MdpOublie({isOpen, onClose})  {

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mot de passe oublié</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Button variant="outline" onClick={handleClose}>
                        X
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )




}

