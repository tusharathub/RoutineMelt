import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";


export async function GET(req: Request, {params }: {params : {date : string}}) {
    try {
        const { searchParams} = new URL(req.url);
        const userId  = searchParams.get("userId");

        if(!userId) {
            return NextResponse.json({error : "UserId is Missing"}, {status : 400})
        }

        const client = await clientPromise;
        const db = client.db("RoutineMelt");

        const tasks = await db
        .collection("tasks")
        .find({userId, date : params.date})
        .toArray();

        return NextResponse.json(tasks);
    } catch(error) {
        return NextResponse.json({error : "Server Error"}, {status : 500})
    }
}