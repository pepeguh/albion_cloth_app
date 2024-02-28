import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { firestore } from "../../firebase";
import { storage } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import store from "../../redux/store";

import "../styles/Profile.css";
const Profile = () => {
  const dispatch = useDispatch();
  const db = firestore;
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  
  const [isChecked, setIsChecked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState({});
  let [fileURL, setFileURL] = useState("");
  
  const [user, setUser] = useState(useSelector((state) => state.user));
  
  const auth = getAuth();
  
  const check1 = useSelector((state) => state.user);

  const testUser = ()=>{
    if(check1!==null){
      
      return true

    }else{
      return false
    }
  }
  const [isAuth, setIsAuth] = useState(testUser());

  useEffect(() => {
    if (user) {
      if(user.uid){
        if(user.uid!==''&&user.uid!==undefined){

          dispatch({ type: "SET_USER", payload: user.uid });
        }
      }
    }
  }, [user]);
  // КОРОЧЕ ИЗ АУТХ ТОЖЕ НАДО В РЕДАКС
  let y = useSelector((state) => state.user);
  useEffect(() => {
    if (y !== null || y !== "") {
      setUser(y);
    }
  }, []);

  const reader = new FileReader();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    selectedFile.name = file.name;
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const content = reader.result;
      selectedFile.img = content;
      setSelectedFile({ name: file.name, img: content });
    };
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const storageRef = ref(storage, `uploads/${user.uid}`);
      try {
        await uploadString(storageRef, selectedFile.img, "data_url");
        fileURL = await getDownloadURL(storageRef);
        setFileURL(await getDownloadURL(storageRef));
      } catch (e) {
        console.error("Ошибка при загрузке файла:", e);
      }
      try {
        const docRef = doc(db, "users_data", user.uid);
        await setDoc(docRef, { picture: fileURL });
      } catch (error) {
        console.log("Ошибка при привязке картинки к профилю: ", error);
      }
    } else {
      console.log("Выберите файл перед загрузкой.");
    }
  };

  const checkHandler = (check) => {
    setIsChecked(true);
    setIsRegistered(check);
  };
  const loginEmailHandler = (e) => {
    let i = e.target.value;
    setLoginEmail(i);
  };
  const loginPasswordHandler = (e) => {
    let i = e.target.value;
    setLoginPassword(i);
  };

  const registerEmailHandler = (e) => {
    let i = e.target.value;
    setRegisterEmail(i);
  };
  const registerPasswordHandler = (e) => {
    let i = e.target.value;
    setRegisterPassword(i);
  };
  const checkPasswordHandler = (e) => {
    let i = e.target.value;
    setCheckPassword(i);
  };

  const authHandler = async () => {
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        // Signed in
        console.log(userCredential.user)
        setUser(userCredential.user);
        setIsAuth(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("ОШИБКА", errorCode, errorMessage);
        dispatch({ type: "SET_USER", payload: null });
        setIsAuth(false);
      });
    // setUserUID(user.uid);
  };
  const registerHandler = () => {
    const item = document.getElementById("registerInput");
    const item2 = document.getElementById("registerInput2");
    const check = registerPassword == checkPassword;
    if (check) {
      item.style.backgroundColor = "#FFFFFF";
      item2.style.backgroundColor = "#FFFFFF";
      createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
        .then((userCredential) => {
          setUser(userCredential.user);
          dispatch({ type: "SET_USER", payload: user.uid });
          setIsAuth(true);
        })
        .catch((error) => {
          setIsAuth(false);
          dispatch({ type: "SET_USER", payload: null });
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("ОШИБКА", errorCode, errorMessage);
        });

      console.log("ОКАЙ");
    } else {
      item.style.backgroundColor = "#c78484";
      item2.style.backgroundColor = "#c78484";
      console.log("НЕ ОКАЙ");
    }
  };
  const signOutHandler = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("ТЫ ВЫШЕЛ");
        dispatch({ type: "SET_USER", payload: null });
        setIsAuth(false);
      })
      .catch((error) => {
        console.log("ТЫ НЕ ВЫШЕЛ, ОШИБКА:", error);
        // An error happened.
      });
  };

  return (
    <div className="main_profile_div">
      <div className="modul_div">
        {!isAuth ? (
          <div className="auth_div">
            {!isChecked ? (
              <div className="auth_div_choose">
                <button onClick={() => checkHandler(true)}>Авторизация</button>
                <button
                  style={{ marginTop: "10px" }}
                  onClick={() => checkHandler(false)}
                >
                  Регистрация
                </button>
              </div>
            ) : (
              <div>
                {isRegistered ? (
                  <div className="login_div">
                    <p>Авторизация</p>
                    <input
                      type="email"
                      placeholder="Email"
                      onChange={(e) => loginEmailHandler(e)}
                    />
                    <input
                      placeholder="Введите пароль"
                      onChange={(e) => loginPasswordHandler(e)}
                      type="password"
                    />
                    <button onClick={() => authHandler()}>ОК</button>
                  </div>
                ) : (
                  <div className="register_div">
                    <p>Регистрация</p>
                    <input
                      placeholder="Email"
                      onChange={(e) => registerEmailHandler(e)}
                    />
                    <input
                      id="registerInput"
                      placeholder="Введите пароль"
                      onChange={(e) => registerPasswordHandler(e)}
                      type="password"
                    />
                    <input
                      id="registerInput2"
                      placeholder="Подтвердите пароль"
                      onChange={(e) => checkPasswordHandler(e)}
                      type="password"
                    />
                    <button onClick={() => registerHandler()}>ОК</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="forUser_div">
            <div className="forUser_exit">
              <div className="forUser_exit_small">
                <button
                  onClick={signOutHandler}
                  style={{ marginBottom: "15px", cursor: "pointer" }}
                >
                  ВЫЙТИ ИЗ АККАУНТА
                </button>
              </div>
            </div>
            <div className="forUser_create">
              <div className="forUser_create_small">
                <p>Мои комлекты:</p>
                <p>сюда что-то....</p>
                <Link to="/profile/creation">
                  <p>Создать новый комплект</p>
                </Link>
              </div>
            </div>
            <div className="forUser_change">
              <div className="forUser_change_small">
                <p>Изменить изображение профиля</p>

                <input
                  id="fileInput"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e)}
                />
                <label id="uploadButton" htmlFor="fileInput">
                  Выбрать файл
                  <button onClick={handleFileUpload}>Загрузить</button>
                </label>
                {selectedFile && <p>Выбран файл: {selectedFile.name}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Profile;
