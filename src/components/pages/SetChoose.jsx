import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { firestore } from "../../firebase";
import "../styles/SetChoose.css";
import { Link } from "react-router-dom";
import Chat from "../elements/chat.jsx";
import { useDispatch, useSelector } from "react-redux";
const SetChoose = () => {
  const user = useSelector(state => state.user);
  const [sets, setSets] = useState([]);
  const [findedSets, setFindedSets] = useState(sets);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const baseUrl = "https://render.albiononline.com/v1/item/T8_";
  const categoriesList = ["gank", "mist", "PVE", "CD"];
  const setsPerPage = 9;
  const indexOfLastSet = currentPage * setsPerPage;
  const indexOfFirstSet = indexOfLastSet - setsPerPage;
  let numberOfPages = findedSets.length / setsPerPage;
  numberOfPages = Math.ceil(numberOfPages);
  let trypepe = [];
  for (let i = 1; i <= numberOfPages; i++) {
    trypepe.push(i);
  }

  const currentSets = findedSets.slice(indexOfFirstSet, indexOfLastSet);

  const pageHandler = (pageNum) => {
    let pepe = pageNum.target.id;
    setCurrentPage(pepe);
    for (let i = 1; i <= numberOfPages; i++) {
      let timeelem = document.getElementById(i);
      if (timeelem.id == pepe) {
        timeelem.style.color = "white";
      } else {
        timeelem.style.color = "black";
      }
    }
  };

  useEffect(() => {
    changeSets();
  }, [selectedCategories, sets]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = collection(firestore, "sets");
        const querySnapshot = await getDocs(collectionRef);
        const data = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            const setData = doc.data();
            let timeName = doc.id.split(" ");
            console.log(timeName);
            let timeid = [...timeName];
            let timeNameGround = [...timeName];
            timeid.splice(1, 99);
            timeid = timeid.join(" ");
            timeName.splice(0, 1);
            timeName = timeName.join(" ");
            timeNameGround = timeNameGround.join("_");

            console.log(timeName, timeid);
            const formattedData = {
              id: timeid,
              groundName: timeNameGround,
              name: timeName,
              description: setData.description,
              categories: setData.categories,
              head: baseUrl + setData.head.uniqueName,
              chest: baseUrl + setData.chest.uniqueName,
              boots: baseUrl + setData.boots.uniqueName,
              weapon: baseUrl + setData.weapon.uniqueName,
              off_hand: baseUrl + setData.off_hand.uniqueName,
              cape: baseUrl + setData.cape.uniqueName,
              potion: baseUrl + setData.potion.uniqueName,
              food: baseUrl + setData.food.uniqueName,
            };

            data.push(formattedData);
          } else {
            console.log(`Документ ${doc.id} не найден`);
          }
        });
        setSets(data);
        setFindedSets(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();

    console.log(sets);
  }, []);
  const findSet = (e) => {
    const value = e.target.value.toLowerCase();
    console.log(value);
    const result = sets.filter((set) => set.name.toLowerCase().includes(value));
    setFindedSets(result);
  };
  const changeSets = () => {
    const result = sets.filter((set) =>
      selectedCategories.every((category) => set.categories.includes(category))
    );

    console.log(result);
    setFindedSets(result);
  };
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(
          (prevCategory) => prevCategory !== category
        );
      } else {
        return [...prevCategories, category];
      }
    });
  };
  const chatHandler = () => {
    console.log("нажал на чат");
    setIsChatOpen(!isChatOpen);
  };
  return (
    <div className="frame">
      <div className="top_frame">
        <input placeholder="Поиск по названию" onChange={findSet} />
        {categoriesList.map((category) => (
          <label className="top_frame_label" key={category}>
            <input
              className={`input_${category}`}
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
            />
            {category}
          </label>
        ))}
      </div>
      <div className="main_main_frame">
        {findedSets ? (
          <div className="main_frame">
            {currentSets.map((set) => (
              <div className="set_main" key={set.name}>
                <h1>{set.name}</h1>
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/setPage/${set.groundName}`}
                >
                  <div className="set_frame">
                    <h1></h1>
                    <img className="img_part" src={set.head} alt="Head" />
                    <img className="img_part" src={set.cape} alt="Cape" />
                    <img className="img_part" src={set.weapon} alt="Weapon" />
                    <img className="img_part" src={set.chest} alt="Chest" />
                    {set.off_hand ? (
                      <img
                        className="img_part"
                        src={set.off_hand}
                        alt="Off Hand"
                      />
                    ) : (
                      <img className="img_part" src={set.weapon} alt="Weapon" />
                    )}
                    <img className="img_part" src={set.potion} alt="Potion" />
                    <img className="img_part" src={set.boots} alt="Boots" />
                    <img className="img_part" src={set.food} alt="Food" />
                  </div>
                </Link>
                <div className="desc_div_small">{set.description}</div>
              </div>
            ))}
           
            {isChatOpen ? (
             user&&<div>
               
                <Chat toggleChat={chatHandler} className="chat_div" />
              </div>
            ) : (
              user&&<div onClick={chatHandler}>
                <IoChatboxEllipsesOutline className="chat_icon" />
              </div>
            )}
            
          </div>
        ) : (
          <span className="anim_loader"> </span>
        )}
      </div>
      <div className="pagination_div">
        {trypepe.map((page) => (
          <p
            id={page}
            className={`page_p${page}`}
            style={{ cursor: "pointer" }}
            onClick={(page) => pageHandler(page)}
          >
            {page}
          </p>
        ))}
      </div>
    </div>
  );
};

export default SetChoose;
