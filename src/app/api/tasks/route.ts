import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, title, date } = await req.json();

    if (!userId || !title || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("RoutineMelt");

    interface TaskDocument {
      userId: string;
      date: string;
      tasks: { title: string; createdAt: Date }[];
    }

    const result = await db.collection<TaskDocument>("tasks").updateOne(
      { userId, date }, 
      {
        $push: { tasks: { title, createdAt: new Date() } },
        $setOnInsert: { userId, date },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!userId || !from || !to) {
      return NextResponse.json({ error: "Missing some query params" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("RoutineMelt");

    const tasks = await db
      .collection("tasks")
      .find({
        userId,
        date: { $gte: from, $lte: to },
      })
      .sort({date : 1})
      .toArray();

    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try{
    const {id} = await req.json();

    if(!id) {
      return NextResponse.json({error : "Task ID is missing"}, {status: 400});
    }

    const client = await clientPromise;
    const db =  client.db("RoutineMelt");

    const result = await db.collection("tasks").deleteOne({_id: new ObjectId(id)})

    if(result.deletedCount === 0) {
      return NextResponse.json({error : "No task found with that ID"}, {status: 400});  
    }

    return NextResponse.json({success: true, result});
  } catch(err) {
    return NextResponse.json({error :"Server error"}, {status: 500})
  }
}
