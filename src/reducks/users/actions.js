// export const EDIT_USER_PROFILE = "EDIT_USER_PROFILE";
// export const editProfileStateAction = (userProfile) => {
//   return {
//     type: "EDIT_USER_PROFILE",
//     payload: userProfile,
//   };
// };

// export const SIGN_IN = "SIGN_IN";
// export const signInAction = (userState) => {
//   return {
//     type: "SIGN_IN",
//     payload: userState,
//   };
// };

// export const SIGN_OUT = "SIGN_OUT";
// export const signOutAction = () => {
//   return {
//     type: "SIGN_OUT",
//     payload: null,
//   };
// };

// export const UPDATE_USER_STATE = "UPDATE_USER_STATE";
// export const updateUserStateAction = (userState) => {
//   return {
//     type: "UPDATE_USER_STATE",
//     payload: userState,
//   };
// };

export const SIGN_IN = "SIGN_IN";
export const signInAction = (userState) => {
  return {
    type: "SIGN_IN",
    payload: {
      isSignedIn: true,
      role: userState.role,
      uid: userState.uid,
      username: userState.username,
    },
  };
};

export const SIGN_OUT = "SIGN_OUT";
export const signOutAction = () => {
  return {
    type: "SIGN_OUT",
    payload: {
      isSignedIn: false,
      role: "",
      uid: "",
      username: "",
    },
  };
};
