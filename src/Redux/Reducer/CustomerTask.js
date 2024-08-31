import { SET_FILTERED_DATA } from '../Action/ActionTypes';

const initialState = {
    filteredData: [],
  };

  const CiustomerTask = (state = initialState, action) => {
    switch (action.type) {
      case SET_FILTERED_DATA:
        return {
          ...state,
          filteredData: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default CiustomerTask;