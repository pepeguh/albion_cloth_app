import React from "react";
import { useEffect, useState, useRef } from "react";
import { firestore } from "../../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useSelector } from "react-redux";
const Chat = ({ toggleChat }) => {
  const user = useSelector((state) => state.user);
  const [userIMG, setUserIMG] = useState("");
  const [userNick, setUserNick] = useState("");
  const [textFromArea, setTextFromArea] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    const db = firestore; // Получаем экземпляр Firestore
    const chatColRef = collection(db, "chat"); // Ссылка на вашу коллекцию сообщений в Firestore
    const q = query(chatColRef, orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Подписка на изменения в коллекции сообщений
      const messagesData = snapshot.docs.map((doc) => doc.data());
      console.log(messagesData);
      setMessages(messagesData);
    });

    return () => {
      unsubscribe(); // Отписка от подписки при размонтировании компонента
    };
  }, []);
  useEffect(() => {
    if (user) {
      console.log(user);
      const fetchImg = async () => {
        try {
          const docRef = doc(firestore, "users_data", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const pepe = docSnap.data();
            setUserIMG(pepe.picture);
            setUserNick(pepe.nick);
            console.log("Данные из Firestore:", userIMG);
          } else {
            console.log("Данные не найдены в Firestore");
          }
        } catch (e) {
          console.error("Ошибка при запросе данных из Firestore:", e);
        }
      };
      fetchImg();
    }
  }, [user]);
  const closeChat = () => {
    toggleChat();
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const getTextFromArea = (e) => {
    setTextFromArea(e.target.value);
    console.log(e.target.value);
  };
  const handleSendMessage = async () => {
    if (textFromArea !== " ") {
      console.log("отправил смсочку");
      const pepe = serverTimestamp();

      const chatColRef = collection(firestore, "chat");
      try {
        await addDoc(chatColRef, {
          message: textFromArea,
          user: user.uid,
          nick: userNick,
          userImg: userIMG,
          createdAt: pepe,
        });
        const textAreainput = document.getElementById("chatTextor");
        textAreainput.value = "";
        console.log("Сообщение успешно добавлено");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="chat_div">
      <div className="chat_div_esc_div">
        <button onClick={closeChat}>X</button>
      </div>
      <div className="chat_div_message_div">
        {messages.map((mes, index) => (
          <div
            className="chat_div_message_div_content"
            key={index}
            style={{ textAlign: mes.user === user.uid ? "right" : "left" }}
          >
            {mes.user === user.uid ? (
              <div
                className="message_user_div"
                style={{
                  justifyContent:
                    mes.user === user.uid ? "flex-end" : "flex-start",
                }}
              >
                <p className="message_nick">{mes.nick}</p>
                <img
                  style={{
                    width: "10%",
                    height: "10%",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                  }}
                  src={mes.userImg}
                  alt="User Avatar"
                ></img>
              </div>
            ) : (
              <div
                className="message_user_div"
                style={{
                  justifyContent:
                    mes.user === user.uid ? "flex-end" : "flex-start",
                }}
              >
                <img
                  style={{ width: "10%", height: "10%" }}
                  src={mes.userImg}
                  alt="User Avatar"
                ></img>
                <p className="message_nick">{mes.nick}:</p>
              </div>
            )}
            <p
              style={{
                marginTop: "5px",
                marginBottom: "5px",
                marginRight: "5px",
              }}
            >
              {mes.message}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat_send_div">
        <textarea
          id="chatTextor"
          onChange={(e) => getTextFromArea(e)}
          className="chat_send_div_textarea"
          type="text"
        />
        <button onClick={handleSendMessage}> {">"}</button>
      </div>
    </div>
  );
};
export default Chat;
