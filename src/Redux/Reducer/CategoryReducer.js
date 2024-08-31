import { SET_CATEGORY } from '../Action/ActionTypes';

const initialState = {
  category: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORY:
      return {
        ...state,
        category: action.payload
      };
    default:
      return state;
  }
};

export default reducer;