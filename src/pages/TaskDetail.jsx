import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { getProjects } from "../features/projects/projectSlice";
import {
  updateTask,
  getTask,
  deleteTask,
  resetVariables,
} from "../features/tasks/taskSlice";

const TaskDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const statusChoices = ["To Do", "In Progress", "In Review", "Done"];
  const [toastMessage, setToastMessage] = useState("");

  const { task, isError, isSuccess, message } = useSelector(
    (state) => state.taskData
  );
  const { projects } = useSelector((state) => state.projectData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 1. Fetch Task and Projects on load
  useEffect(() => {
    dispatch(getTask(params.taskId));
    dispatch(getProjects());
  }, [dispatch, params.taskId]);

  // 2. Sync Form with Task Data (Only when task.id is loaded)
  useEffect(() => {
    if (task && task.id) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "", // Formats for <input type="date">
        project_id: task.project_id,
      });
    }
  }, [task, reset]);

  // 3. Handle Success/Error Notifications
  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(resetVariables());
    }

    if (isSuccess && toastMessage) {
      toast.success(toastMessage);
      dispatch(resetVariables());
      navigate("/kanban");
    }
  }, [dispatch, isError, isSuccess, message, navigate, toastMessage]);

  const updateTaskUtil = (formData) => {
  // Use params.taskId (from URL) instead of task.id
  const taskId = params.taskId; 

  if (!taskId || taskId === "undefined") {
    return toast.error("Task ID is missing. Please refresh.");
  }

  const payload = {
    ...formData,
    id: parseInt(taskId, 10), // Convert to integer for backend
    project_id: parseInt(formData.project_id, 10)
  };
  dispatch(updateTask(payload));
};

  const deleteTaskUtil = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this task?")) {
      setToastMessage("Task successfully deleted!");
      dispatch(deleteTask(params.taskId));
    }
  };

  // Loading State
  if (!project?.id && !task?.id) {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl font-bold text-gray-400 animate-pulse">Syncing with database...</p>
    </div>
  );
}

  return (
    <form
      onSubmit={handleSubmit(updateTaskUtil)}
      className="md:w-1/2 sm:w-3/4 mx-auto my-3 p-6 bg-white shadow-md rounded"
    >
      <p className="text-center text-2xl mb-6 text-red-700 font-bold uppercase tracking-wide">
        Task Detail
      </p>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-blue-500"
          id="title"
          type="text"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-blue-500"
          id="description"
          rows="5"
          {...register("description", { required: "Description is required" })}
        ></textarea>
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="project_id">
          Project
        </label>
        <select
          {...register("project_id", { required: "Project selection is required" })}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-blue-500"
        >
          {projects.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
          Status
        </label>
        <select
          {...register("status", { required: "Status is required" })}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-blue-500"
        >
          {statusChoices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
          Due Date
        </label>
        <input
          className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-blue-500"
          id="dueDate"
          type="date"
          {...register("dueDate", { required: "Due date is required" })}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded transition duration-200"
          type="submit"
        >
          Update Task
        </button>
        <button
          onClick={deleteTaskUtil}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded transition duration-200"
        >
          Delete Task
        </button>
      </div>
    </form>
  );
};

export default TaskDetail;