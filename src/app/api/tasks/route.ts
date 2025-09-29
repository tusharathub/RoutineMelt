import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, title, date } = await req.json();

    if (!userId || !title || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("RoutineMelt");

    const task = {
      userId,
      title,
      date, // YYYY-MM-DD
      createdAt: new Date(),
    };

    await db.collection("tasks").insertOne(task);

    return NextResponse.json({ success: true, task });
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
      .toArray();

    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
