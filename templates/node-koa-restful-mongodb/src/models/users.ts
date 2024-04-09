import { db } from "../db";

interface IUsers {
  username: string;
  password: string;
  name: string;
}

export const users = db.collection<IUsers>("users");
