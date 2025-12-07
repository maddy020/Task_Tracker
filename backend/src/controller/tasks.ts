import { createTaskInDb, getAllTasksFromDb } from "../model/tasks";
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
    console.log(user);
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

export async function updateTask() {}

export async function deleteTask() {}

export async function searchTask() {}
