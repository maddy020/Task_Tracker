import { JwtPayload } from "jsonwebtoken";
import { query } from "../utils/db";

export async function getAllTasksFromDb(user: JwtPayload) {
  try {
    const userId = user.id;
    const allTasks = await query(`SELECT * FROM tasks where user_id=$1`, [
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

export async function updateTaskInDb(
  user: JwtPayload,
  taskId: number,
  taskDetails: any
) {
  try {
    const userId = user.id;
    let index = 1;

    const setClauses: string[] = [];
    const params: any[] = [];

    const isExistingTask = await query(`SELECT * FROM tasks where id=$1`, [
      taskId,
    ]);
    if (isExistingTask.rowCount == 0) {
      return {
        success: true,
        message: "No such task found",
      };
    }
    if (taskDetails.title) {
      setClauses.push(`title = $${index++}`);
      params.push(taskDetails.title);
    }

    if (taskDetails.description) {
      setClauses.push(`description = $${index++}`);
      params.push(taskDetails.description);
    }

    if (taskDetails.status) {
      setClauses.push(`status = $${index++}`);
      params.push(taskDetails.status);
    }

    if (taskDetails.priority) {
      setClauses.push(`priority = $${index++}`);
      params.push(taskDetails.priority);
    }

    if (taskDetails.due_date) {
      setClauses.push(`due_date = $${index++}`);
      params.push(taskDetails.due_date);
    }
    if (setClauses.length === 0) {
      return {
        success: false,
        message: "No valid fields to update",
      };
    }

    const dbQuery = `
      UPDATE tasks
      SET ${setClauses.join(", ")}
      WHERE id = $${index} AND user_id = $${index + 1}
      RETURNING *;
    `;

    params.push(taskId, userId);

    const response = await query(dbQuery, params);

    return {
      success: true,
      message: "Success",
      result: response.rows,
    };
  } catch (error) {
    console.log("Error in updating the task in db", error);
    return {
      success: false,
      message: "Fail",
      result: [],
    };
  }
}

export async function deleteTaskInDb(user: JwtPayload, taskId: Number) {
  try {
    const userId = user.id;
    const response = await query(
      `DELETE FROM tasks where id=$1 and user_id=$2`,
      [taskId, userId]
    );
    if (response) {
      return {
        success: true,
        result: response.rows,
      };
    }
    return {
      success: true,
      result: [],
    };
  } catch (error) {
    console.log("Error in deleting  the task in db", error);
    return {
      success: false,
      result: [],
    };
  }
}

export async function searchTaskInDb(user: JwtPayload, searchKeyword: string) {
  try {
    const userId = user.id;
    const response = await query(
      `SELECT * FROM tasks
   WHERE (title ILIKE '%' || $1 || '%' 
      OR description ILIKE '%' || $1 || '%')
     AND user_id = $2`,
      [searchKeyword, userId]
    );
    if (response) {
      return {
        success: true,
        result: response.rows,
      };
    }
    return {
      success: true,
      result: [],
    };
  } catch (error) {
    console.log("Error in deleting  the task in db", error);
    return {
      success: false,
      result: [],
    };
  }
}
