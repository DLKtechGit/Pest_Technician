// reducer.js

import { UPDATE_SELECTED_TASK } from '../Action/Action';

const initialState = {
  selectedTask: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_TASK:
      return {
        ...state,
        selectedTask: action.payload,
      };
    default:
      return state;
  }
};

export default taskReducer;
