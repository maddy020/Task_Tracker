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
        success: true,
        result: allTasks.rows,
        rowCount: allTasks.rowCount,
      };
    }
    return {
      success: true,
      result: [],
      rowCount: 0,
    };
  } catch (error) {
    console.log("Error in get query from db", error);
    return {
      success: false,
      result: [],
      rowCount: 0,
    };
  }
}

export async function createTaskInDb(user: JwtPayload, task: any) {
  try {
    const userId = user.id;
    const dbQuery = `INSERT INTO tasks
        (user_id, title, description, due_date, priority, status)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;
    const params = [
      userId,
      task.title,
      task.description || null,
      task.due_date || null,
      task.priority || "medium",
      task.status || "todo",
    ];
    const response = await query(dbQuery, params);
    if (response) {
      return {
        success: true,
        result: response.rows,
        rowCount: response.rowCount,
      };
    }
    return {
      success: true,
      result: [],
      rowCount: 0,
    };
  } catch (error) {
    console.log("Error in creating the tasks in db", error);
    return {
      success: false,
      result: [],
      rowCount: 0,
    };
  }
}

export async function updateTaskInDb() {}

export async function deleteTaskInDb() {}

export async function searchTaskInDb() {}
