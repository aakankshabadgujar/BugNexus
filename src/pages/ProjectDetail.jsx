import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

import {
  updateProject,
  getProject,
  deleteProject,
  resetVariables,
} from "../features/projects/projectSlice";

const ProjectDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");

  // Select project data from Redux state
  // FIX: Ensure this matches the slice name in your store (projectData vs project)
  const { project, isError, isSuccess, message } = useSelector(
    (state) => state.projectData 
  );

  // Fetch project details on component load
  useEffect(() => {
    if (params.projectId) {
      dispatch(getProject(params.projectId));
    }
  }, [dispatch, params.projectId]);

  // Handle Toast notifications and navigation
  useEffect(() => {
    const toastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    };

    if (isError) {
      toast.error(message || "An error occurred", toastOptions);
      dispatch(resetVariables());
    }

    if (isSuccess && toastMessage) {
      toast.success(toastMessage, toastOptions);
      dispatch(resetVariables());
      navigate("/projects");
    }
  }, [dispatch, isError, isSuccess, navigate, message, toastMessage]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Update form values when project data arrives from backend
  useEffect(() => {
    if (project && project.title) {
      reset({
        title: project.title,
        description: project.description,
      });
    }
  }, [project, reset]);

  // Updated Update logic to prevent 'undefined' URL errors
  const updateProjectUtil = (formData) => {
  const projectId = params.projectId; // Use URL parameter

  if (!projectId || projectId === "undefined") {
    return toast.error("Project ID is missing.");
  }

  const payload = {
    ...formData,
    id: parseInt(projectId, 10)
  };
  dispatch(updateProject(payload));
};

  const deleteProjectUtil = (e) => {
    e.preventDefault();
    if (!project?.id) {
      toast.error("Cannot delete: Project ID not found.");
      return;
    }
    setToastMessage("Project successfully deleted!");
    dispatch(deleteProject(project.id));
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
      onSubmit={handleSubmit(updateProjectUtil)}
      className="md:w-1/2 sm:w-3/4 mx-auto my-3"
    >
      <p className="text-center text-2xl my-3 text-red-700 font-bold">
        DETAILS FOR: {project?.title?.toUpperCase()}
      </p>
      
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="title"
        >
          Title
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="title"
          type="text"
          placeholder="Project Title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          placeholder="Project Description"
          rows="10"
          {...register("description", { required: "Description is required" })}
        ></textarea>
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded transition duration-200"
          type="submit"
        >
          Update Details
        </button>
        <button
          onClick={deleteProjectUtil}
          className="shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded transition duration-200"
        >
          Delete Project
        </button>
      </div>
    </form>
  );
};

export default ProjectDetail;