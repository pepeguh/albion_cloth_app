import { SET_USER } from "./actions";

const initialState = {
  user: null,
  nickname:null,
  uid:null,
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user:{
          uid: action.payload.uid,
          nickname: action.payload.nickname
        } 
          
      };

    default:
      return state;
  }
};

export default rootReducer;