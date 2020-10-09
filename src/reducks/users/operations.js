import { db, auth, FirebaseTimestamp } from "../../firebase/index";
import { signOutAction, signInAction } from "./actions";
import { push } from "connected-react-router";
import {
  isValidEmailFormat,
  isValidRequiredInput,
} from "../../function/common";
// import { hideLoadingAction, showLoadingAction } from "../loading/actions";

const usersRef = db.collection("users");

// Sign In

export const signIn = (email, password) => {
  return async (dispatch) => {
    // dispatch(showLoadingAction("Sign in..."));

    // 未入力の場合
    if (!isValidRequiredInput(email, password)) {
      //   dispatch(hideLoadingAction());
      alert("メールアドレスかパスワードが未入力です。");
      return false;
    }

    // メールアドレスの形式が不正の場合
    if (!isValidEmailFormat(email)) {
      //   dispatch(hideLoadingAction());
      alert("メールアドレスの形式が不正です。");
      return false;
    }
    return auth.signInWithEmailAndPassword(email, password).then((result) => {
      const userState = result.user;
      if (userState) {
        const userId = userState.uid;

        return usersRef
          .doc(userId)
          .get()
          .then((snapshot) => {
            const data = snapshot.data();

            dispatch(
              signInAction({
                isSignedIn: true,
                role: data.role,
                uid: userId,
                username: data.username,
              })
            );

            dispatch(push("/"));
          });
      }
    });
  };
};

// Sign Up

export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    // Validations
    // 未入力の場合
    if (!isValidRequiredInput(email, password, confirmPassword)) {
      alert("必須項目が未入力です。");
      return false;
    }

    // メールアドレスの形式が適切でない場合
    if (!isValidEmailFormat(email)) {
      alert("メールアドレスの形式が不正です。もう1度お試しください。");
      return false;
    }

    // パスワードが一致しない場合
    if (password !== confirmPassword) {
      alert("パスワードが一致しません。もう1度お試しください。");
      return false;
    }

    // パスワードが６語未満の場合
    if (password.length < 6) {
      alert("パスワードは6文字以上で入力してください。");
      return false;
    }

    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // dispatch(showLoadingAction("Sign up..."));
        const user = result.user;
        if (user) {
          const uid = user.uid;
          const timestamp = FirebaseTimestamp.now();

          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "user",
            uid: uid,
            updated_at: timestamp,
            username: username,
          };

          usersRef
            .doc(uid)
            .set(userInitialData)
            .then(async () => {
              // const sendThankYouMail = functions.httpsCallable('sendThankYouMail');
              // await sendThankYouMail({
              //     email: email,
              //     userId: uid,
              //     username: username,
              // });
              dispatch(push("/"));
            });
        }
      })
      .catch((error) => {
        alert("アカウント登録に失敗しました。もう1度お試しください。");
        throw new Error(error);
      });
  };
};

// Auth Listen

export const listenAuthState = () => {
  return async (dispatch) => {
    return auth.onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            const data = snapshot.data();
            if (!data) {
              throw new Error("ユーザーデータが存在しません。");
            }

            // Update logged in user state
            dispatch(
              signInAction({
                email: data.email,
                isSignedIn: true,
                role: data.role,
                uid: user.uid,
                username: data.username,
              })
            );
          });
      } else {
        dispatch(push("/signin"));
      }
    });
  };
};

// signout

export const signOut = () => {
  return async (dispatch) => {
    // dispatch(showLoadingAction("Sign out..."));
    // const uid = getState().users.uid;

    // Sign out with Firebase Authentication
    auth
      .signOut()
      .then(() => {
        dispatch(signOutAction());
        // dispatch(hideLoadingAction());
        dispatch(push("/signin"));
      })
      .catch(() => {
        throw new Error("ログアウトに失敗しました。");
      });
  };
};
