import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../models/User";

export async function POST(request: any) {
  const { name, email } = await request.json();
  await connectMongoDB();
}
