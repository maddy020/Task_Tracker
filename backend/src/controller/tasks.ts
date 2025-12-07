import { getAllTasksFromDb } from "../model/tasks";
import { customRequest } from "../utils/types";
import type { Response } from "express";

export async function getAllTasks(req: customRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "No user Found" });
    }
    const response = await getAllTasksFromDb(user);
    if (response) {
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

export async function createTask() {}

export async function updateTask() {}

export async function deleteTask() {}

export async function searchTask() {}
