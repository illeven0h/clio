import { firestore } from "../../../../firebase/functions/server";
import { NextRequest, NextResponse } from "next/server";

export enum ItemAccess {
    USER = "USER",
    ADMIN = "ADMIN",
    GUESTUSER = "GUESTUSER"

}

export type item = {
    id: string;
    title: string;
    access: string;
}

const defaultItem: item[] = [
    {id: "item-1", title: "user item", access: ItemAccess.USER},
    {id: "item-2", title: "user item", access: ItemAccess.USER},
    {id: "item-3", title: "guest user item", access: ItemAccess.GUESTUSER},
    {id: "item-4", title: "admin item", access: ItemAccess.ADMIN},
    {id: "item-5", title: "admin item", access: ItemAccess.ADMIN},
]

export async function GET(request: NextRequest){
    try{
        if(!firestore){
            return new NextResponse("Internal Error", {status: 500,})
        }

        const response = await firestore.collection("Items").get();
        const items = response.doc.map((doc) => doc.data())

        return NextResponse.json(items);
    }catch(err){
        return new NextResponse("internal error", {status:500})
    }

}