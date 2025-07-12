import { ACTION_TYPE } from "../actions";
import { ROLE } from "../constants/role";

const initialUserState = {
  id: null,
  name: null,
  email: null,
  roleId: ROLE.GUEST,
};

export const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case ACTION_TYPE.SET_USER: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};
