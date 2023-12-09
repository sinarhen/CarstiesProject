import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Auction } from "@/types";

const DetailedSpecs = ({
    auction,
}: {
    auction: Auction;
}) => {
    return (
        <Table>
            <TableCaption>Auction Specifications</TableCaption>
            <TableBody>
                <TableRow>
                    <TableCell>Seller</TableCell>
                    <TableCell>{auction.seller}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Make</TableCell>
                    <TableCell>{auction.make}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Model</TableCell>
                    <TableCell>{auction.model}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Year manufactured</TableCell>
                    <TableCell>{auction.year}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Mileage</TableCell>
                    <TableCell>{auction.mileage} km</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Reserve price</TableCell>
                    <TableCell>{auction.reservePrice + '$' ?? "None"}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default DetailedSpecs;

