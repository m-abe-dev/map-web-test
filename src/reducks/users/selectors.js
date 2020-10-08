import { createSelector } from "reselect";

const useSelector = (state) => state.users;

export const getUserId = createSelector([usersSelector], (state) => state.uid);
