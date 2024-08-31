// reducers/taskReducer.js

const initialState = {
  taskStatus:null
  };

  const updateTaskreducer = (state = initialState, action) => {
    switch (action.type) {
      case "UPDATE_TASK_STATUS":        
        return {
          ...state,
          taskStatus: action.payload 
        };
      default:
        return state;
    }
  };
  
  export default updateTaskreducer;
  