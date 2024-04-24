import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";
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
import { FaTrashCan } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import store from "../../redux/store";

import "../styles/Profile.css";
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const db = firestore;
  const baseUrl = "https://render.albiononline.com/v1/item/T8_";
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [isNickNamePlaced, setIsNickNamePlaced] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [NickShit, setNickShit] = useState("Ник занят");
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isNickLoading, setIsNickLoading] = useState(false)

  const [selectedFile, setSelectedFile] = useState();
  let [fileURL, setFileURL] = useState("");
  const [sets, setSets] = useState([]);
  const [semiSet, setSemiSet] = useState([]);
  let [schet, setSchet] = useState(0);
  let [schet1, setSchet1] = useState(0);
  let [schet2, setSchet2] = useState(0);
  let [schet3, setSchet3] = useState(0);

  const [votedSets, setVotedSets] = useState([]);

  const [user, setUser] = useState(useSelector((state) => state.user));

  const auth = getAuth();

  const check1 = useSelector((state) => state.user);

  const yesBtnArr = document.getElementsByClassName("yes");

  const noBtnArr = document.getElementsByClassName("no");

  const no1SvgArr = document.getElementsByClassName("no1");

  const trashBtnArr = document.getElementsByClassName("trash");

  // const schethandler=()=>{
  //   setSchet(schet++)
  //   return schet
  // }
  // const schet1handler=()=>{
  //   setSchet1(schet1++)
  //   return schet1
  // }
  const testUser = () => {
    if (check1 !== null) {
      return true;
    } else {
      return false;
    }
  };

  const [isAuth, setIsAuth] = useState(testUser());

  useEffect(() => {
    if (user) {
      if (user !== "" && user !== undefined) {
        dispatch({ type: "SET_USER", payload: user });
      }
    }

    const downloadUserSets = async () => {
      try {
        const setsCollection = collection(firestore, "sets");

        const docRef = doc(firestore, "users_data", user.uid);
        const docSnap = await getDoc(docRef);
        const userVoted = docSnap.data().complects;
        const tryArr = [];
        const getteditems = [];
        for (const key in userVoted) {
          if (
            typeof userVoted[key] === "object" &&
            userVoted[key].voted === true
          ) {
            tryArr.push(key);
          }
        }
        let newpepega = [];
        for (let i = 0; i < tryArr.length; i++) {
          newpepega.push(tryArr[i].split("_").join(" "));
        }
        console.log(newpepega);
        await Promise.all(
          newpepega.map(async (el) => {
            const docSetsRef = doc(firestore, "sets", el);
            const pepe = await getDoc(docSetsRef);
            let timeName = pepe.id.split(" ");

            timeName.splice(0, 1);
            timeName = timeName.join(" ");
            getteditems.push({ id: timeName, ...pepe.data() });
          })
        );
        setVotedSets(getteditems);
        console.log(getteditems);

        const q = query(setsCollection, where("user", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const setsData = [];
        querySnapshot.forEach((doc) => {
          let timeName = doc.id.split(" ");

          timeName.splice(0, 1);
          timeName = timeName.join(" ");
          let pepega = doc.id.split(" ").join("_");

          setsData.push({ groundName: pepega, id: timeName, ...doc.data() });
        });

        setSets(setsData);
        console.log(setsData);
      } catch (error) {
        console.error("Ошибка при запросе данных из Firestore:", error);
      }
    };
    if (user) {
      console.log("ПРОКАЕТ ЗАПРОС НА СЕТЫ с этими данными - ", user.uid);
      downloadUserSets();
    } else {
      console.log("НЕ ПРОКАЕТ ЗАПРОС с этими данными - ", user);
    }
  }, [user]);

  let y = useSelector((state) => state.user);
  useEffect(() => {
    if (y !== null || y !== "") {
      setUser(y);
    }
  }, []);

  const reader = new FileReader();
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // setSelectedFile({name:'',img:''})
    // selectedFile.name = file.name;
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const content = reader.result;
      // selectedFile.img = content;
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
        setSelectedFile("");
      } catch (e) {
        console.error("Ошибка при загрузке файла:", e);
      }
      try {
        const docRef = doc(db, "users_data", user.uid);
        let chech = await getDoc(docRef);
        if (chech.exists()) {
          await updateDoc(docRef, { picture: fileURL });
        } else {
          await setDoc(docRef, { picture: fileURL });
        }
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
  const registerNickNameHandler = async (e) => {
    let i = e.target.value;
    if (i == "") {
      setNickShit("Никнейм не должен содержать пробелов");
      setIsNickNamePlaced(true);
      return;
    }
    let check = i.split("");
    if (check.length < 4) {
      setNickShit("Никнейм слишком короткий");
      setIsNickNamePlaced(true);
      return;
    } else if (check.length > 16) {
      setNickShit("Никнейм слишком длинный");
      setIsNickNamePlaced(true);
      return;
    }
    for (let i = 0; i < check.length; i++) {
      if (check[i] == "" || check[i] == " ") {
        setNickShit("Никнейм не должен содержать пробелов");
        setIsNickNamePlaced(true);
        return;
      }
    }
    setNickName(i);
    let timedNick = i
    console.log(check);
    try {
      setIsNickLoading(true)
      const docRef = collection(db, "users_data");
      const q = query(docRef, where("nick", "==", timedNick));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setNickShit("Никнейм занят");
        setIsNickNamePlaced(true);
        setIsNickLoading(false)

        return;
      } else {
        setIsNickNamePlaced(false);
        setIsNickLoading(false)

      }
    } catch (error) {
      console.error(error);
    }
  };
  const getUserNick = async (userUid) => {
    try {
      const docRef = doc(db, "users_data", userUid);
      const timedDoc = await getDoc(docRef);
      const nickname = timedDoc.data().nick;

      setUser({ uid: userUid, nickname: nickname });
      dispatch(setUser({ uid: userUid, nickname: nickname }));
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  };
  const authHandler = async () => {
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        // Signed in
        //ВОТ ЕБАТЬ НЕ ПЕРЕБАТь

        getUserNick(userCredential.user.uid);

        // setUser(userCredential.user.uid);
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
  const registerHandler = async () => {
    const item = document.getElementById("registerInput");
    const item2 = document.getElementById("registerInput2");
    const check = registerPassword == checkPassword;
    if (check) {
      item.style.backgroundColor = "#FFFFFF";
      item2.style.backgroundColor = "#FFFFFF";
      createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
        .then((userCredential) => {
          setUser(userCredential.user.uid);
          try {
            const docRef = doc(db, "users_data", `${userCredential.user.uid}`);
            setDoc(docRef, { nick: nickName });
          } catch (error) {
            console.error(error);
          }
          dispatch(setUser({ uid: user.uid }));
          setIsAuth(true);
          navigate("/");
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

  const deleteStateSets = (detect, checker) => {
    console.log("вызов удаления c id", detect);
    checker.splice(detect, 1);
    console.log("вот что осталось - ", checker);
    setSets(checker);
  };
  const deleteUserSet = async (e) => {
    let detect = e.target.id;
    let choosedDoc = sets[detect].id;
    let choosedName = sets[detect].user;
    const checkname = sets[detect].groundName;
    let cheker = [...sets];
    console.log(cheker);
    try {
      await deleteDoc(doc(db, `sets`, `${choosedName} ${choosedDoc}`)).then(
        deleteStateSets(detect, cheker)
      );

      //удаление данных из всех пользователей об этом комплекте
      const usersDataQuery = query(collection(db, "users_data"));
      const usersDataSnapshot = await getDocs(usersDataQuery);

      const promises = usersDataSnapshot.docs.map(async (docSnapshot) => {
        const userData = docSnapshot.data();

        if (userData.complects && userData.complects[checkname]) {
          console.log("до", userData.complects);
          delete userData.complects[checkname];
          console.log("после", userData.complects);

          await updateDoc(doc(db, "users_data", docSnapshot.id), {
            complects: userData.complects,
          });
        }
      });

      await Promise.all(promises);
      console.log("Комплект успешно удален у всех пользователей");
    } catch (error) {
      console.error(
        "Ошибка при удалении комплекта у всех пользователей:",
        error
      );
    }
  };
  const areUSure = (e) => {
    let detect = e.target.id;

    e.target.parentElement.style.display = "none";
    yesBtnArr[detect].style.display = "flex";
    noBtnArr[detect].style.display = "flex";
    no1SvgArr[detect].style.display = "flex";

    e.target.parentElement.parentElement.style.overflow = "hidden";
    e.target.parentElement.parentElement.style.width = "40px";
    e.target.parentElement.parentElement.style.borderRight = "1px solid black";
    e.target.parentElement.parentElement.style.borderLeft = "1px solid black";
  };
  const resetStyles = (e) => {
    let detect = e.target.id;
    console.log(detect);
    console.log(e.target);

    trashBtnArr[detect].parentElement.style.display = "flex";

    yesBtnArr[detect].style.display = "none";
    noBtnArr[detect].style.display = "none";
    no1SvgArr[detect].style.display = "none";

    e.target.parentElement.parentElement.style.overflow = "visible";
    e.target.parentElement.parentElement.style.width = "0px";

    e.target.parentElement.parentElement.style.border = "none";
    e.target.parentElement.parentElement.style.border = "none";
  };

  const settingsVisibleHandler = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };
  const changeNick = async()=>{
    const i = document.getElementById('NameChange') 
    const item = i.value
    console.log('меняю ник на',item)
    const docRef = doc(db,'users_data',user.uid)
    try{
      await updateDoc(docRef, { nick: item });
      dispatch({ type: "SET_USER", payload: {uid:user.uid,nickname:item }});
    //ВСЁ РАБОТАЕТ, НУЖНО СДЕЛАТЬ ЧТОБЫ ЕЩЕ НИКНЕЙМ В СЕТАХ МЕНЯЛСЯ 

    }catch(e){
      console.error('Ошибка при изменении никнейма - ',e)
    }
  }

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
                      id="Name"
                      placeholder="Введите никнейм"
                      type="text"
                      minlength="4"
                      maxlength="16"
                      onChange={(e) => registerNickNameHandler(e)}
                    />
                    {isNickNamePlaced ? (
                      <p style={{ color: "red" }}>{NickShit}</p>
                    ) : (
                      <p style={{ color: "green" }}>Ник не занят</p>
                    )}
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
              <div className="voted_sets_div">
                <p>Избранное</p>

                {votedSets.map((set) => (
                  <div className="forUser_create_small_mySets_set" key={set.id}>
                    <Link
                      to={`/setPage/${set.groundName}`}
                      className="forUser_create_small_mySets_set_link_div"
                    >
                      <img
                        className="create_small_mySets_set_img"
                        src={set.weapon ? baseUrl + set.weapon.uniqueName : ""}
                      ></img>
                    </Link>
                    <p className="create_small_mySets_set_p">{set.id}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="forUser_create">
              <div className="forUser_create_small">
                <Link to="/profile/creation">
                  <p>Создать новый комплект</p>
                </Link>
                <p>Мои комлекты:</p>
                <div className="forUser_create_small_mySets">
                  {sets.map((set) => (
                    <div
                      className="forUser_create_small_mySets_set"
                      key={set.id}
                    >
                      <Link
                        to={`/setPage/${set.groundName}`}
                        className="forUser_create_small_mySets_set_link_div"
                      >
                        <img
                          className="create_small_mySets_set_img"
                          src={baseUrl + set.weapon.uniqueName}
                        ></img>
                      </Link>
                      <p className="create_small_mySets_set_p">{set.id}</p>
                      <div className="forUser_create_small_mySets_set_svg">
                        <div className="trashdiv">
                          <button
                            className="trash"
                            onClick={areUSure}
                            id={schet++}
                          >
                            ....
                          </button>
                          <FaTrashCan className="trash1" />
                        </div>

                        <button
                          id={schet3++}
                          onClick={deleteUserSet}
                          className="yes1"
                        >
                          ..
                        </button>
                        <FaCheck id={schet2++} className="yes" />

                        <div className="nodiv">
                          <button
                            id={schet1++}
                            className="no"
                            onClick={resetStyles}
                          >
                            ..
                          </button>
                          <RxCross2 className="no1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="forUser_change">
              <button onClick={settingsVisibleHandler}>
                Изменить данные аккаунта
              </button>
              <div
                className={`forUser_change_small ${
                  isSettingsVisible ? "expanded" : "small"
                }`}
              >
                <p style={{ marginBottom: "10px" }}>
                  Изменить изображение профиля
                </p>

                <input
                  id="fileInput"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e)}
                  accept="image/jpeg, image/png, image/bmp, image/jpg"
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label id="uploadButton" htmlFor="fileInput">
                    Выбрать файл
                  </label>
                  {selectedFile && <p>Выбран файл: {selectedFile.name}</p>}
                  {selectedFile && (
                    <button
                      style={{ marginTop: "5px" }}
                      onClick={handleFileUpload}
                    >
                      Загрузить
                    </button>
                  )}
                </div>
                <div>
                  <p style={{ marginBottom: "10px" }}>Изменить никнейм</p>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <input
                      id="NameChange"
                      placeholder="Введите никнейм"
                      type="text"
                      minlength="4"
                      maxlength="16"
                      onChange={(e) => registerNickNameHandler(e)}
                    />
                   
                  </div>
                  {isNickLoading?(
                  <p>Loading...</p>  
                  ):
                
                 (<>
                   {isNickNamePlaced ? (
                    <button className="nickPlaced">{NickShit}</button>
                  ) : (
                    <button onClick={changeNick} className="nickFree">Подтвердить</button>
                  )}
                  </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Profile;
