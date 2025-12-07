import { JwtPayload } from "jsonwebtoken";
import { query } from "../utils/db";

export async function getAllTasksFromDb(user: JwtPayload) {
  try {
    const userId = user.id;
    const allTasks = await query("SELECT * FROM tasks where user_id=${1}", [
      userId,
    ]);
    if (allTasks) {
      return {
        result: allTasks.rows,
        rowCount: allTasks.rowCount,
      };
    }
    return {
      result: [],
      rowCount: 0,
    };
  } catch (error) {
    console.log("Error in get query from db", error);
    return {
      result: [],
      rowCount: 0,
    };
  }
}

export async function createTaskInDb() {}

export async function updateTaskInDb() {}

export async function deleteTaskInDb() {}

export async function searchTaskInDb() {}
