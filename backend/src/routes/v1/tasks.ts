import { Router } from "express";
import { checkUser } from "../../middleware/user";
import {
  getAllTasks,
  createTask,
  updateTask,
  searchTask,
  deleteTask,
} from "../../controller/tasks";
const router = Router();

router.get("/", checkUser, getAllTasks);
router.post("/", checkUser, createTask);
router.patch("/:taskId", checkUser, updateTask);
router.get("/search", checkUser, searchTask);
router.delete("/:taskId", checkUser, deleteTask);

export default router;
