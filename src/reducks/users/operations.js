import { db, auth, FirebaseTimestamp } from "../../firebase/index";
import {
  signOutAction,
  signInAction,
  editProfileStateAction,
  fetchProductsInCartAction,
  fetchOrdersHistoryAction,
} from "./actions";

export const signIn = (email, password) => {
  return async (dispatch) => {
    dispatch(showLoadingAction("Sign in..."));

    // 未入力の場合
    if (!isValidRequiredInput(email, password)) {
      dispatch(hideLoadingAction());
      alert("メールアドレスかパスワードが未入力です。");
      return false;
    }

    // メールアドレスの形式が不正の場合
    if (!isValidEmailFormat(email)) {
      dispatch(hideLoadingAction());
      alert("メールアドレスの形式が不正です。");
      return false;
    }
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        const userState = result.user;
        if (!userState) {
          dispatch(hideLoadingAction());
          throw new Error("ユーザーIDを取得できません");
        }
        const userId = userState.uid;

        return usersRef
          .doc(userId)
          .get()
          .then((snapshot) => {
            const data = snapshot.data();
            if (!data) {
              dispatch(hideLoadingAction());
              throw new Error("ユーザーデータが存在しません");
            }

            dispatch(
              signInAction({
                email: data.email,
                isSignedIn: true,
                role: data.role,
                payment_method_id: data.payment_method_id
                  ? data.payment_method_id
                  : "",
                uid: userId,
                username: data.username,
              })
            );

            dispatch(hideLoadingAction());
            dispatch(push("/"));
          });
      })
      .catch(() => {
        dispatch(hideLoadingAction());
      });
  };
};

export const signUp = (username, email, password, confirmPassword) => {
  return async (dispatch) => {
    // Validations
    // 未入力の場合
    if (
      usename === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
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
        dispatch(showLoadingAction("Sign up..."));
        const user = result.user;
        if (user) {
          const uid = user.uid;
          const timestamp = FirebaseTimestamp.now();

          const userInitialData = {
            created_at: timestamp,
            email: email,
            role: "user",
            payment_method_id: "",
            uid: uid,
            updated_at: timestamp,
            username: username,
          };

          db.collection("users")
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
              //   dispatch(hideLoadingAction());
            });
        }
      })
      .catch((error) => {
        dispatch(hideLoadingAction());
        alert("アカウント登録に失敗しました。もう1度お試しください。");
        throw new Error(error);
      });
  };
};
