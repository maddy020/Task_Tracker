import {
  createTaskInDb,
  deleteTaskInDb,
  getAllTasksFromDb,
  searchTaskInDb,
  updateTaskInDb,
} from "../model/tasks";
import { customRequest } from "../utils/types";
import type { Response } from "express";

export async function getAllTasks(req: customRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "No user Found" });
    }
    const response = await getAllTasksFromDb(user);
    if (response.success) {
      return res
        .status(200)
        .json({ message: "Success", tasks: response.result });
    }
    return res.status(400).json({ message: "Fail", tasks: [] });
  } catch (error) {
    console.log("Error in getting tasks of the user", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createTask(req: customRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "No User Found" });
    }
    const { task } = req.body;
    if (!(task.title || task.priority || task.status)) {
      return res.status(404).json({ message: "Task Fields can not be empty" });
    }
    const response = await createTaskInDb(user, task);
    if (response.success) {
      return res
        .status(200)
        .json({ message: "Success", task: response.result });
    }
    return res.status(400).json({ message: "Fail", task: {} });
  } catch (error) {
    console.log("Error in getting tasks of the user", error);
    return res.status(500).json({ message: "Internal Server Error", task: {} });
  }
}

export async function updateTask(req: customRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "No User Found" });
    }
    const { taskId } = req.params;
    const { taskDetails } = req.body;
    const parsedId = parseInt(taskId as string);
    if (!parsedId || !taskDetails) {
      return res.status(404).json({ message: "task details can not be empty" });
    }
    const response = await updateTaskInDb(user, parsedId, taskDetails);
    if (response.success) {
      return res.status(200).json({ message: response.message });
    }
    return res.status(400).json({ message: response.message });
  } catch (error) {
    console.log("Error in getting tasks of the user", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteTask(req: customRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "No User Found" });
    }
    const { taskId } = req.params;
    const parsedId = parseInt(taskId as string);
    if (!parsedId) {
      return res.status(404).json({ message: "task id can not be empty" });
    }
    const response = await deleteTaskInDb(user, parsedId);
    if (response.success) {
      return res.status(200).json({ message: "Success" });
    }
    return res.status(400).json({ message: "Fail" });
  } catch (error) {
    console.log("Error in getting tasks of the user", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function searchTask(req: customRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "No User Found" });
    }
    const { searchKeyword } = req.query;
    if (!searchKeyword) {
      return res.status(404).json({ message: "No keyword found" });
    }
    const response = await searchTaskInDb(user, searchKeyword as string);
    if (response.success) {
      return res
        .status(200)
        .json({ message: "Success", tasks: response.result });
    }
    return res.status(400).json({ message: "Fail", tasks: [] });
  } catch (error) {
    console.log("Error in getting tasks of the user", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", tasks: [] });
  }
}
