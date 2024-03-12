import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase";
import "../styles/SetChoose.css";

const SetChoose = () => {
  const [sets, setSets] = useState([]);
  const [findedSets, setFindedSets] = useState(sets);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const baseUrl = "https://render.albiononline.com/v1/item/T8_";
  const categoriesList = ["gank", "mist", "PVE", "CD"];
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
            const formattedData = {
              name: doc.id,
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
        {findedSets.length ? (
          <div className="main_frame">
            {findedSets.map((set) => (
              <div className="set_main" key={set.name}>
                <h1>{set.name}</h1>
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
                  <p>{set.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>ПЕПЕГА</p>
        )}
      </div>
    </div>
  );
};

export default SetChoose;
