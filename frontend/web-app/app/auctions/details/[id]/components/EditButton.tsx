import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Auction } from "@/types";
import EditForm from './EditForm';


export function EditButton({
    initialValues,
}: {
    initialValues: Auction;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Auction</Button>
            </DialogTrigger>
            <DialogContent className="lg:max-w-screen-md overflow-y-scroll max-h-screen sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit auction</DialogTitle>
                    <DialogDescription>
                        Make changes to your auction here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <EditForm initialValues={initialValues} />
            </DialogContent>
    </Dialog >
    );
}
