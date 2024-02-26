import React, { useEffect, useState } from "react";
import { collection, getDocs, } from "firebase/firestore";
import { firestore } from "../../firebase";
import "../styles/SetChoose.css";

const SetChoose = () => {
  const [sets, setSets] = useState([]);
  const baseUrl = "https://render.albiononline.com/v1/item/T8_";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = collection(firestore, "mist");
        const querySnapshot = await getDocs(collectionRef);

        const data = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            const setData = doc.data();

           
            const formattedData = {
              name: doc.id,
              head: baseUrl+setData.head.uniqueName,
              chest: baseUrl+setData.chest.uniqueName,
              boots: baseUrl+setData.boots.uniqueName,
              weapon: baseUrl+setData.weapon.uniqueName,
              off_hand: baseUrl+setData.off_hand.uniqueName,
              cape: baseUrl+setData.cape.uniqueName,
              potion: baseUrl+setData.potion.uniqueName,
              food: baseUrl+setData.food.uniqueName,
            };

            data.push(formattedData);
          } else {
            console.log(`Документ ${doc.id} не найден`);
          }
        });

        setSets(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
    console.log(sets);
  }, []);

  return (
    <div className="main_frame">
      {sets.map((set) => (
        <div className="set_main" key={set.name}>
          <h1>{set.name}</h1>
          <div className="set_frame">
            <h1></h1>
           <img  className="img_part" src={set.head} alt="Head" /> 
             <img className="img_part" src={set.cape} alt="Cape" /> 
            <img className="img_part" src={set.weapon} alt="Weapon" />
             <img className="img_part" src={set.chest} alt="Chest" /> 
             {set.off_hand ? (
              <img className="img_part" src={set.off_hand} alt="Off Hand" />
            ) : (
              <img className="img_part" src={set.weapon} alt="Weapon" />
            )}
            <img className="img_part" src={set.potion} alt="Potion" />
            <img className="img_part" src={set.boots} alt="Boots" />
            <img className="img_part" src={set.food} alt="Food" /> 
          </div>
        </div>
      ))}
    </div>
  );
};

export default SetChoose;
