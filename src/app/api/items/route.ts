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

const defaultItems: item[] = [
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

        const response = await firestore.collection("items").get();
        const items = response.docs.map((doc) => doc.data())
        
        //this is to make sure everything gets stored on the firestore and in case of errors it reverts the updation
        if(items.length <= 0){
            const batch = firestore.batch();
            defaultItems.forEach((item) => {
                const itemRef = firestore?.collection("items").doc();
                if (itemRef) batch.set(itemRef, item);
            });
            batch.commit();

            return NextResponse.json(defaultItems)

        }


        return NextResponse.json(items);
    }catch(err){
        return new NextResponse("internal error", {status:500})
    }

}