import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";

import { deleteAuction } from "@/app/actions/auctionActions";

export default function DeleteButton({
    auctionId,
}: {
    auctionId: string;
}) {

    const onDeleteConfirmation = () => {
        const res = deleteAuction(initialValues.id);
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete Auction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete auction</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this auction?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>

                        <Button variant="outline" onClick={onDeleteConfirmation}>
                            Yes
                        </Button>
                        <Button variant="outline">
                            No
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
    </Dialog >
    );
}
