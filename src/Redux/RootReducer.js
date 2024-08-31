// RootReducer.js

import { combineReducers } from 'redux';
import userReducer from './Reducer/Reducer';
import taskReducer from './Reducer/TaskReducer';
import forgotEmailReducer from './Reducer/ForgotReducer';
import updateTaskreducer from './Reducer/UpdateTaskReducer';
import CategoryReducer from './Reducer/CategoryReducer';
import ServiceNameReducer from './Reducer/ServiceNameReducer';
import UpdateStatuscompleted from './Reducer/UpdateStatuscompleted';

const rootReducer = combineReducers({
  user: userReducer,
  task: taskReducer,
  taskStatus:updateTaskreducer,
  forgotEmailReducer: forgotEmailReducer,
  CategoryReducer:CategoryReducer,
  ServiceNameReducer:ServiceNameReducer,
  UpdateStatuscompleted: UpdateStatuscompleted,
});

export default rootReducer;
