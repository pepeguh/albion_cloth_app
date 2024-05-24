import "../styles/Header.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "../../firebase";
const Header = () => {
  const [userIMG, setUserIMG] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [goldPrice, setGoldPrice] = useState("?");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user.uid) {
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
    } else {
      setUserIMG("?");
    }
  }, [user]);
  async function goldFetch() {
    let response = await fetch(
      "https://europe.albion-online-data.com/api/v2/stats/Gold?count=5"
    );
    let summ = 0;
    let i = 0;
    if (response.ok) {
      let ans = await response.json();

      for (i = 0; i < ans.length; i++) {
        summ = summ + ans[i].price;
      }
      ans = (summ / i).toFixed(0);
      return ans;
    } else {
      console.log("Ошибка запроса цены золота: " + response.status);
      return "error, try again";
    }
  }
  useEffect(() => {
    setIsLoading(true);
    const waitingGold = async () => {
      try {
        const result = await goldFetch();
        setGoldPrice(result);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    waitingGold();
  }, []);
  return (
    <div className="main_header">
      <div className="main_container">
        <Link to="/" className="header_link">
          <div className="header_home header_link_block">
            <p className="header_link_text">Home</p>
          </div>
        </Link>
        <Link to='/prices' className="header_link">
        <div className="header_prices header_link_block">
          <p className="header_link_text">Prices</p>
        </div>
        </Link>
        <div className="gold_price_div m_p">
          <p>
              {isLoading ? <p>Loading...</p> : <p>Курс золота : {goldPrice}</p>}

          </p>
            </div>
        <div
          style={{ display: "flex", alignItems: "center", color: "#c3d6d1" }}
        >
          {user && (
            <p style={{ marginRight: "10px", fontSize: "large" }}>
              {user.nickname}
            </p>
          )}
          <div className="header_avatar">
            <Link to="/profile" className="header_avatar_link">
              {userIMG == "?" ? (
                <span>{userIMG}</span>
              ) : (
                <img src={userIMG.picture} />
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
