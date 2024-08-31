// actions/userActions.js
import ApiService from "../../Services/TaskServices";
import { SET_FILTERED_DATA } from '../Action/ActionTypes';
import { SET_CATEGORY,SET_SERVICENAME } from '../Action/ActionTypes';

export const setUserData = (userData,forgotEmail) => {
  localStorage.setItem("userData", JSON.stringify(userData)); // Store user data in local storage
  return {
    type: "SET_USER_DATA",
    payload:userData,
  };
};


export const clearUserData = () => {
  localStorage.removeItem("userData"); // Remove user data from local storage
  return {
    type: "CLEAR_USER_DATA",
  };
};

export const setForgotEmails = (userData,forgotEmail) => {
  localStorage.setItem("forgotEmail", JSON.stringify(forgotEmail)); // Store user data in local storage
  return {
    type: "SET_FORGOT_DATA",
    payload:forgotEmail,
  };
};


export const clearsetForgotEmail = () => {
  localStorage.removeItem("forgotEmail"); // Remove user data from local storage
  return {
    type: "CLEAR_FORGOT_DATA",
  };
};

// actions/taskActions.js

export const SET_TASK_DETAILS = 'SET_TASK_DETAILS';

export const setTaskDetailsAction  = (selectedTask, customerDetails, selectedTaskId) => ({
  type: SET_TASK_DETAILS,
  payload: {
    selectedTask,
    customerDetails,
    selectedTaskId,
  }
});


export const FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE';

export const fetchTasks = () => {
  return async (dispatch) => {
    dispatch(fetchTasksRequest());
    try {
      const response = await ApiService.TaskList(); 
      // debugger;
      dispatch(fetchTasksSuccess(response.data));
    } catch (error) {
      dispatch(fetchTasksFailure(error.message)); 
    }
  };
};

// Action creator functions for different stages of fetching tasks
export const fetchTasksRequest = () => {
  return {
    type: FETCH_TASKS_REQUEST
  };
};

export const fetchTasksSuccess = (tasks) => {
  return {
    type: FETCH_TASKS_SUCCESS,
    payload: tasks
  };
};

export const fetchTasksFailure = (error) => {
  return {
    type: FETCH_TASKS_FAILURE,
    payload: error
  };
};



export const fetchTaskstatus = () => {
  return async (dispatch) => {
    dispatch(fetchTasksRequest());
    try {
      const response = await ApiService.GetStartTasks(); 
      // debugger;
      dispatch(fetchTasksSuccess(response.data));
    } catch (error) {
      dispatch(fetchTasksFailure(error.message)); 
    }
  };
};

// actionTypes.js

export const setFilteredData = (filteredData) => {
  return {
    type: SET_FILTERED_DATA,
    payload: filteredData,
  };
};


export const setCategoryAction = (category) => {
  return {
    type: SET_CATEGORY,
    payload: category
  };
};

export const setServiceNameAction = (serviceName) => {
  return {
    type: SET_SERVICENAME,
    payload: serviceName
  };
};

export const UPDATE_SELECTED_TASK = 'UPDATE_SELECTED_TASK';

export const updateSelectedTask = (taskData) => ({
  type: UPDATE_SELECTED_TASK,
  payload: taskData,
});