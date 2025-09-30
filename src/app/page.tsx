import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();

  if(!user) {
    return <h1>Please sign in first</h1>
  }

  return(
    <div>
      <h1>Welcome back, {user.firstName} </h1>
      <Link href={`/grid`}> Check progress </Link>
    </div>
  )
}