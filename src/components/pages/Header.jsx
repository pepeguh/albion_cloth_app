import "../styles/Header.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "../../firebase";
const Header = () => {
  const [userIMG, setUserIMG] = useState("");
  
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user&&user.uid) {
      console.log(user);
      const fetchImg = async () => {
        try {
          const docRef = doc(firestore, "users_data", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserIMG(docSnap.data());
            console.log("Данные из Firestore:", userIMG);
          } else {
            console.log("Данные не найдены в Firestore");
          }
        } catch (e) {
          console.error("Ошибка при запросе данных из Firestore:", e);
        }
      };
      fetchImg();
    }else{
      setUserIMG('?');
    }
  }, [user]);

  return (
    <div className="main_header">
      <div className="main_container">
          <Link to="/" className="header_link">
        <div className="header_home">
            <p className="header_home_text">
              Home
              
              </p>
        </div>
          </Link>
    <div style={{display:'flex', alignItems:'center',color:'#c3d6d1'}}>
         {user&&
          <p style={{marginRight:'10px',fontSize:'large'}}>{user.nickname}</p>}
        <div className="header_avatar">
          <Link to="/profile" className="header_avatar_link">
            {userIMG=='?'? <span>{userIMG}</span> : <img src={userIMG.picture}/>            }
            
          </Link>
        </div>

    </div>
      </div>
    </div>
  );
};

export default Header;
