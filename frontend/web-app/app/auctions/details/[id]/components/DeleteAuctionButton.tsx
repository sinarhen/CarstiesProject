'use client';

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

import { deleteAuction } from "@/actions/auctionActions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteButton({
    auctionId,
}: {
    auctionId: string;
}) {
    const router = useRouter();
    async function onDeleteConfirmation(){
        const res = await deleteAuction(auctionId);
        if (res?.error) {
          toast.error(res.error.message || "Something went wrong");
          return;
        }
        toast.success("Auction deleted successfully");
        router.push('/');
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
                    <DialogClose>
                        <Button variant="destructive" onClick={onDeleteConfirmation}>
                            Yes
                        </Button>
                        <Button className="ml-3" variant="outline">
                            No
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
    </Dialog >
    );
}
