import React, { useEffect, useState } from "react";
import "../styles/SetCreation.css";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import test2 from "../elements/items";
const SetCreation = () => {
  const categoriesList = ['gank', 'mist', 'PVE', 'CD'];
  const [nameChange, setNameChange] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(test2);
  const [currentItem, setCurrentItem] = useState({});
  const [head, setHead] = useState({});
  const [cape, setCape] = useState({});
  const [weapon, setWeapon] = useState({});
  const [chest, setChest] = useState({});
  const [off_hand, setOff_hand] = useState({});
  const [potion, setPotion] = useState({});
  const [boots, setBoots] = useState({});
  const [food, setFood] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([])
  const [description, setDescription] = useState("Без описания");
  const navigate = useNavigate();
  const baseUrl = "https://render.albiononline.com/v1/item/";
  const test0 =
    "https://render.albiononline.com/v1/item/PLAYERISLAND_FURNITUREITEM_STONE_MAGIC_EMBLEM_GROUND_B";
  const db = firestore;
  const user = useSelector(state => state.user);
  useEffect(() => {
    if (off_hand.slot == "weapon") {
      const elem = document.getElementById("item_off_hand");
      elem.style.opacity = 0.5;
    }
  }, [off_hand]);

  useEffect(() => {
    const buttonSend = document.getElementById("btn1");
    if (
      head.slot &&
      cape.slot &&
      weapon.slot &&
      chest.slot &&
      off_hand.slot &&
      potion.slot &&
      boots.slot &&
      food.slot &&
      user &&
      nameChange !== "" &&
      buttonSend
    
    ) {
      buttonSend.style.backgroundColor = "#4c7c4c";
      buttonSend.style.cursor = "pointer";
    } else if(!buttonSend){
     
    }else{
      buttonSend.style.background = "#b13e3e";
      buttonSend.style.cursor = "not-allowed";
      console.log(nameChange);
      console.log("ЧТО ТО НЕ ЗАПОЛНЕНО");
    }
  }, [head, cape, off_hand, weapon, potion, food, chest, boots, nameChange,user]);
  const renameHandler = (e) => {
    const value = e.target.value;
    setNameChange(value);
  };
  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredResults = test2.filter((item) =>
      item.ruName.toLowerCase().includes(value)
    );
    setSearchResults(filteredResults);
  };
  const handleDescription = (e) => {
    const value = e.target.value;
    setDescription(value);
  };

  const dragStartHandler = (e, item) => {
    console.log("dragStart:", item);
    e.target.style.opacity = "0.5";
    setCurrentItem(item);
  };
  const dragEndHandler = (e) => {
    e.target.style.backgroundColor = "#92908d";
    e.target.style.opacity = "1";
  };
  const dragOverHandler = (e) => {
    e.preventDefault();
    e.target.style.backgroundColor = "#757471";

    // console.log("НЕ НАВОДИ НА МЕНЯ");
  };
  const dragLeaveHandler = (e) => {
    e.target.style.backgroundColor = "#92908d";
    // console.log("НЕ НАВОДИ НА МЕНЯ");
  };
 
// dropHandler(10, 'paket')

  const dropHandler = (e, item) => {

    e.preventDefault();
    console.log("drop:", item);
  };

  const headDropHandler = (e, item) => {
    if (currentItem.slot == "head") {
      setHead(currentItem);
    }
  };
  const capeDropHandler = (e, item) => {
    if (currentItem.slot == "cape") {
      setCape(currentItem);
    }
  };
  const weaponDropHandler = (e, item) => {
    if (currentItem.slot == "weapon") {
  
      if(currentItem.name.includes('2H')){
        setOff_hand(currentItem);
      }else if(off_hand.slot=="weapon"){
        setOff_hand({});
      }
    

      setWeapon(currentItem);
    }
  };
  const chestDropHandler = (e, item) => {
    if (currentItem.slot == "chest") {
      setChest(currentItem);
    }
  };
  const off_handDropHandler = (e, item) => {
    let check = [];
    let YN = false;
    if (weapon.name) {
      YN = false;
      check = weapon.name.split("");
      for (let i = 0; i < check.length; i++) {
        if (check[i] + check[i + 1] == "2H") {
          YN = true;
        }
      }
    }
    if (currentItem.slot == "off_hand" && !YN) {
      setOff_hand(currentItem);
    }
  };
  const potionDropHandler = (e, item) => {
    if (currentItem.slot == "potion") {
      setPotion(currentItem);
    }
  };
  const bootsDropHandler = (e, item) => {
    if (currentItem.slot == "boots") {
      setBoots(currentItem);
    }
  };
  const foodDropHandler = (e, item) => {
    if (currentItem.slot == "food") {
      setFood(currentItem);
    }
  };

  const publishSet = async () => {
    let semiSet = {};
    if (
      !head.slot ||
      !cape.slot ||
      !weapon.slot ||
      !chest.slot ||
      !off_hand.slot ||
      !potion.slot ||
      !boots.slot ||
      !food.slot ||
      !user

    ) {
      console.log("ЧТО ТО НЕ ЗАПОЛНЕНО");
    } else {
      console.log("ВСЁ ЗАПОЛНЕНО, ВСТАВЛЯЮ");
      // name:nameChange,
      let semigroundName = `${user.uid} ${nameChange}`
      let almosthere = semigroundName.split(' ').join('_')
      semiSet = {
        groundName:almosthere,
        user:user.uid,
        nick:user.nickname,
        head: head,
        cape: cape,
        weapon: weapon,
        chest: chest,
        off_hand: off_hand,
        potion: potion,
        boots: boots,
        food: food,
        description: description,
        categories:selectedCategories
      };
      try {
        const docRef = doc(db, "sets", `${user.uid} ${nameChange}`);
        await setDoc(docRef, semiSet);
        console.log("Document written with ID: ", docRef.id);
        navigate('/profile')
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      console.log(semiSet);
    }
  };
  const handleCategoryToggle = (category)=>{
    setSelectedCategories((prevCategories)=>{
      if(prevCategories.includes(category)){
        return prevCategories.filter((prevCategory)=>prevCategory!==category);
      }else{
        return [...prevCategories, category];
      }
    });
  };


  return (
    <div className="main_div">
      
      <div className="main_left_side ">
        <div className="semi_left_side">
          <input onChange={renameHandler} placeholder="Название" />

          <div className="puzzle_main_set">
            <div
              className="puzzle_item_set"
              style={{ backgroundColor: "transparent" }}
            />
            <div
              className="puzzle_item_set"
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => headDropHandler()}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragLeave={(e) => dragEndHandler(e)}
            >
              {head.name ? (
                <img draggable={false} src={baseUrl + head.name} />
              ) : (
                <img draggable={false} src={test0} />
              )}
              <span>{head.ru_name}</span>
            </div>
            <div
              className="puzzle_item_set"
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => capeDropHandler()}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragLeave={(e) => dragEndHandler(e)}
            >
              {cape.name ? (
                <img draggable={false} src={baseUrl + cape.name} />
              ) : (
                <img draggable={false} src={test0} />
              )}
              <span>{cape.ru_name}</span>
            </div>
            <div
              className="puzzle_item_set"
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => weaponDropHandler()}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragLeave={(e) => dragEndHandler(e)}
            >
              {weapon.name ? (
                <img draggable={false} src={baseUrl + weapon.name} />
              ) : (
                <img draggable={false} src={test0} />
              )}
              <span>{weapon.ru_name}</span>
            </div>
            <div
              className="puzzle_item_set"
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => chestDropHandler()}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragLeave={(e) => dragEndHandler(e)}
            >
              {chest.name ? (
                <img draggable={false} src={baseUrl + chest.name} />
              ) : (
                <img draggable={false} src={test0} />
              )}
              <span>{chest.ru_name}</span>
            </div>
            <div
              id="item_off_hand"
              className="puzzle_item_set"
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => off_handDropHandler()}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragLeave={(e) => dragEndHandler(e)}
            >
              {off_hand.name ? (
                <img draggable={false} src={baseUrl + off_hand.name} />
              ) : (
                <img draggable={false} src={test0} />
              )}
              <span>{off_hand.ru_name}</span>
            </div>
            <div
              className="puzzle_item_set"
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => potionDropHandler()}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragLeave={(e) => dragEndHandler(e)}
            >
              {potion.name ? (
                <img draggable={false} src={baseUrl + potion.name} />
              ) : (
                <img draggable={false} src={test0} />
              )}
              <span>{potion.ru_name}</span>
            </div>
            <div
              className="puzzle_item_set"
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => bootsDropHandler()}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragLeave={(e) => dragEndHandler(e)}
            >
              {boots.name ? (
                <img draggable={false} src={baseUrl + boots.name} />
              ) : (
                <img draggable={false} src={test0} />
              )}
              <span>{boots.ru_name}</span>
            </div>
            <div
              className="puzzle_item_set"
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => foodDropHandler()}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragLeave={(e) => dragEndHandler(e)}
            >
              {food.name ? (
                <img draggable={false} src={baseUrl + food.name} />
              ) : (
                <img draggable={false} src={test0} />
              )}
              <span>{food.ru_name}</span>
            </div>
          </div>
                
          <textarea
            placeholder="Описание..."
            className="left_side_description"
            onChange={handleDescription}
            // value={description}
          ></textarea>

          <div className="left_side_categories">
          {categoriesList.map((category)=>(
            <label className="left_side_label" key={category}>
              <input
              className={`input_${category}`}
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={()=>handleCategoryToggle(category)}
              />
               {category}
            </label>
          ))}
          </div>

        </div>
        {user? 
        <button
          className="left_side_btn"
          id="btn1"
          onClick={() => publishSet()}
        >
          Опубликовать
        </button>
        :
        <Link to={'/profile'} >Войдите чтобы создавать комплекты</Link>
        }
      </div>

      <div className="puzzle_main_choose">
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={handleChange}
        />

        <div className="puzzle_list">
          {searchResults.map((item, index) => (
            <div
              draggable={true}
              onDragStart={(e) => dragStartHandler(e, item)}
              onDragLeave={(e) => dragLeaveHandler(e)}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragOver={(e) => dragOverHandler(e)}
              // onDrop={(e) => dropHandler(e)}
              key={index}
              className="puzzle_item"
            >
              <img draggable={false} src={baseUrl + item.name} />
              <span>{item.ruName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SetCreation;
