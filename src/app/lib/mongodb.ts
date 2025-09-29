import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

if(!uri) {
    throw new Error("Add mongodb URI in .env");
}

let client : MongoClient;
let clientPromise : Promise<MongoClient>

declare global {
    var _mongoClientPromise : Promise<MongoClient>
}

if(process.env.NODE_ENV === "development") {
    if(!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise; 
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;