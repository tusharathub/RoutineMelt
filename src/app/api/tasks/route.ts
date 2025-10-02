import clientPromise from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

interface TaskDocument {
  _id : ObjectId,
  userId : string,
  date : string,
  tasks: {_id : ObjectId, title : string, createdAt : Date }[],
}

export async function POST(req: Request) {
  try {
    const { userId, title, date } = await req.json();

    if (!userId || !title || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("RoutineMelt");

    const newTask = {_id : new ObjectId(), title, createdAt : new Date() };
    const result = await db.collection<TaskDocument>("tasks").updateOne(
      { userId, date }, 
      {
        $push: { tasks: newTask },
        $setOnInsert: { userId, date },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, task: newTask, result });
  } catch (err) {
    console.log("Server error", err)
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
      .collection<TaskDocument>("tasks")
      .find({
        userId,
        date: { $gte: from, $lte: to },
      })
      .sort({date : 1})
      .toArray();

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET error", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try{
    const {id, userId, date} = await req.json();

    if(!id || !date || !userId) {
      return NextResponse.json({error : "Task ID, userId or date is missing"}, {status: 400});
    }

    const client = await clientPromise;
    const db =  client.db("RoutineMelt");

    const result = await db.collection<TaskDocument>("tasks").updateOne(
      {userId, date},
      {$pull : {tasks : {_id : new ObjectId(id)}}}
    )

    if(result.modifiedCount === 0) {
      return NextResponse.json({error : "No task found with that ID"}, {status: 400});  
    }

    return NextResponse.json({success: true, result});
  } catch(err) {
    console.log("DELETE error", err);
    return NextResponse.json({error :"Server error"}, {status: 500})
  }
}

export async function PUT(req : Request) {
  try{
    const {id, title, date} = await req.json();

    if(!id || !title || !date) {
      return NextResponse.json({error : "Missing fields"}, {status: 400});
    }

    const client = await clientPromise;
    const db = client.db("RoutineMelt");

    const update: Record<string, unknown> = {};
    if(title) update.title = title;
    if(date) update.date = date;

    const result = await db
    .collection("tasks")
    .updateOne({_id: new ObjectId(id)}, {$set: update});

    if(result.matchedCount === 0) {
      return NextResponse.json({error : "Task not found"}, {status: 404});
    }

    return NextResponse.json({success : true, updateId : id, update});
  } catch (err) {
    console.log("Server error", err);
    return NextResponse.json({error : "server error"}, {status : 500});
  }
}
