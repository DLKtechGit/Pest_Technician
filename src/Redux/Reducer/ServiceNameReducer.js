import { SET_SERVICENAME } from '../Action/ActionTypes';

const initialState = {
  serviceName: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVICENAME:
      return {
        ...state,
        serviceName: action.payload
      };
    default:
      return state;
  }
};

export default reducer;