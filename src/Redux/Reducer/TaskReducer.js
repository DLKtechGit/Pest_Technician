// reducers/taskReducer.js

const initialState = {
  selectedTask: null,
  customerDetails: null,
  selectedTaskId: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TASK_DETAILS":
      return {
        ...state,
        task: {
          ...state.user,
          selectedTask: action.payload.selectedTask,
          customerDetails: action.payload.customerDetails,
          selectedTaskId: action.payload.selectedTaskId,
        },
      };
    default:
      return state;
  }
};

export default taskReducer;
