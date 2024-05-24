import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc,setDoc,updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
// import Select from "react-select";
import "../styles/SetPage.css";
const SetPage = () => {
  const [formattedData, setFormattedData] = useState(null);
  const { setId } = useParams();
  const [rait, setRait] = useState(null)
  const [choosedRait, setChoosedRait] = useState(null)
  const [user,setUser] = useState(useSelector((state) => state.user))
  const [isVoted, setIsVoted] = useState(null)
  const [buildPrice, setBuildPrice] = useState(0)
  let timeSet, nameSet, idSet, fetchName;
  
  console.log(setId)
  
  const baseUrl = "https://render.albiononline.com/v1/item/";
  useEffect(()=>{
    const btnvot = document.getElementById('btnVoted');
    const getUsersVote=async()=>{
      const docRef = doc(firestore, "users_data", user.uid);
      try {
        const doctimed = await getDoc(docRef)
        const docData = doctimed.data()
        if(docData.complects){
          if(docData.complects[setId]){
            if(docData.complects[setId].voted)
           
             setIsVoted(docData.complects[setId].voted)
          }
          
        }
      } catch (error) {
        console.error(error)
      }
    }   
    if(btnvot){
      if(isVoted){
        btnvot.style.color = 'yellow'
          
          
        }else{
          btnvot.style.color = 'black'
        }
        getUsersVote()
    }
  })
  if (setId) {
    timeSet = setId.split("_");
    nameSet = [...timeSet];
    idSet = [...timeSet];
    fetchName = [...timeSet].join(" ");
    nameSet.splice(0, 1);
    nameSet = nameSet.join(" ");
    idSet.splice(1, 99);
    idSet = idSet.join(" ");
  }
  const raitingHandlerGood = () => {
    setChoosedRait(1)
       console.log('ХОРОШ');
       const elem = document.getElementById('star_check');
       elem.style.color = 'green'
       addSetRaitingToUser(1)
  };
  const raitingHandlerBad = ()=>{
    setChoosedRait(-1)
    console.log('ПЛООХ');
    const elem = document.getElementById('star_check');
    elem.style.color = 'red'
    addSetRaitingToUser(-1)
  }
  const addSetRaitingToUser=async(raitCheck)=>{
    let dtata;
    let diff=0;
    let newrait=0
    let checkvoted = true;
     if(user!==null){
      try {
        const docRef = doc(firestore, "users_data", user.uid);
        const docdata = await getDoc(docRef)
        
           dtata = docdata.data()
           console.log(dtata)
           if(dtata.complects[setId].raiting){
            diff = dtata.complects[setId].raiting
           }
          console.log(raitCheck)
        
      } catch (error) {
        
      }
      try {
      console.log('прокнуло',user.uid)
      const docRef = doc(firestore, "users_data", user.uid);
      const docSnap = await getDoc(docRef);
      const userData =docSnap.data()
  
      
      let complectsData = userData.complects || {}; // Объект с данными о комплектах
      let complectData = complectsData[setId] || {}; // Данные конкретного комплекта
     

       if(!diff){
        newrait = raitCheck
        complectData = {
          ...complectData,
          raiting: raitCheck
        };
        complectsData = {
          ...complectsData,
          [setId]: complectData
        };
        await updateDoc(docRef, { complects: complectsData });
        
       }else if(raitCheck==1){
        if(diff==1){
          newrait = -1;
          complectData = {
            ...complectData,
            raiting: 0
          };
          complectsData = {
            ...complectsData,
            [setId]: complectData
          };
          await updateDoc(docRef, { complects: complectsData });
        }
        if(diff==-1){
          newrait = 2
          complectData = {
            ...complectData,
            raiting: raitCheck
          };
          complectsData = {
            ...complectsData,
            [setId]: complectData
          };
          await updateDoc(docRef, { complects: complectsData });
        }
      }else if(raitCheck==-1){
        if(diff==1){
          newrait = -2;
          complectData = {
            ...complectData,
            raiting: raitCheck
          };
          complectsData = {
            ...complectsData,
            [setId]: complectData
          };
          await updateDoc(docRef, { complects: complectsData });
        }
        if(diff==-1){
          newrait = 1
          complectData = {
            ...complectData,
            raiting: 0
          };
          complectsData = {
            ...complectsData,
            [setId]: complectData
          };
          await updateDoc(docRef, { complects: complectsData });
         
        }
      }
      
      } catch (error) {
        console.log("Ошибка установки оценки комплекта в объект пользователя: ", error);
      }
      try{
        let prev=0
        if(typeof rait=='string' ){
          setRait(0)
          prev=0
        }else{

          prev = rait;
        }
        prev = prev+newrait
        console.log(prev)
        setRait(prev)
        let name = setId.split('_').join(' ');
        const docRef = doc(firestore,'sets',name);
        await updateDoc(docRef, { raiting: prev });
      }catch(error){

      }
     }
  }
  const fetchVote = async()=>{
    const btnvot = document.getElementById('btnVoted');
    
    if(isVoted){
      btnvot.style.color = 'black'
      
    }else{
      btnvot.style.color = 'yellow'
    }
    try{
      const docRef = doc(firestore, "users_data", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let pepe
        if(isVoted===null){
          pepe=true
          setIsVoted(true)
        }
        else if(isVoted===true){
          pepe=false
          setIsVoted(false)
        }else if(isVoted===false){
          pepe=true
          setIsVoted(true)
        }
        const userData = docSnap.data();
        let complectsData = userData.complects || {}; // Объект с данными о комплектах
        let complectData = complectsData[setId] || {}; // Данные конкретного комплекта
        complectData = {
          ...complectData,
          voted: pepe

          
        };
        complectsData = {
          ...complectsData,
          [setId]: complectData
        };
        await updateDoc(docRef, { complects: complectsData });
      } else {
        console.log('Document does not exist');
      }
    }catch(e){
      console.log("Error updating document: ", e)
    }


  }
  useEffect(() => {
    
    if (setId) {
      const downloadUserSets = async () => {
        const docRef = doc(firestore, "sets", fetchName);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const docData = docSnap.data();
            console.log("Document data:", docData);
            if(docData.raiting){
              if(docData.raiting==0){
                setRait(docData.raiting)
              }
              setRait(docData.raiting)
            }else{
              setRait(0)
            }
            
            setFormattedData({
              nickname:docData.nick,
              id: idSet,
              name: nameSet,
              description: docData.description,
              categories: docData.categories,
              head: {
                img: baseUrl + docData.head.name,
                name: docData.head.ruName,
              },
              chest: {
                img: baseUrl + docData.chest.name,
                name: docData.chest.ruName,
              },
              boots: {
                img: baseUrl + docData.boots.name,
                name: docData.boots.ruName,
              },
              weapon: {
                img: baseUrl + docData.weapon.name,
                name: docData.weapon.ruName,
              },
              off_hand: {
                img: baseUrl + docData.off_hand.name,
                name: docData.off_hand.ruName,
              },
              cape: {
                img: baseUrl + docData.cape.name,
                name: docData.cape.ruName,
              },
              potion: {
                img: baseUrl + docData.potion.name,
                name: docData.potion.ruName,
              },
              food: {
                img: baseUrl + docData.food.name,
                name: docData.food.ruName,
              },
            });
          } else {
            console.log("No document found with the name:", fetchName);
          }
        } catch (error) {
          console.error("Ошибка при запросе данных из Firestore:", error);
        }
      };
      downloadUserSets();
    }
  }, [setId]);

  return (
    <div style={{marginTop:'5px'}}>
            {formattedData ? (
        <div className="main_personal_div">
          <div>
            <h1>{formattedData.name}</h1>
            <div className="main_personal_frame">
              <h1></h1>
              <div className="frame_set_part">
                <p className="frame_set_part_name">{formattedData.head.name}</p>
                <img
                  className="img_part"
                  src={formattedData.head.img}
                  alt="Head"
                />
              </div>
              <div className="frame_set_part">
                <p className="frame_set_part_name">{formattedData.cape.name}</p>
                <img
                  className="img_part"
                  src={formattedData.cape.img}
                  alt="Cape"
                />
              </div>
              <div className="frame_set_part">
                <p className="frame_set_part_name">
                  {formattedData.weapon.name}
                </p>
                <img
                  className="img_part"
                  src={formattedData.weapon.img}
                  alt="Weapon"
                />
              </div>
              <div className="frame_set_part">
                <p className="frame_set_part_name">
                  {formattedData.chest.name}
                </p>
                <img
                  className="img_part"
                  src={formattedData.chest.img}
                  alt="Chest"
                />
              </div>
              {formattedData.off_hand ? (
                <div className="frame_set_part">
                  <p className="frame_set_part_name">
                    {formattedData.off_hand.name}
                  </p>
                  <img
                    className="img_part"
                    src={formattedData.off_hand.img}
                    alt="Off Hand"
                  />
                </div>
              ) : (
                <div className="frame_set_part">
                  <p className="frame_set_part_name">
                    {formattedData.weapon.name}
                  </p>
                  <img
                    className="img_part"
                    src={formattedData.weapon.img}
                    alt="Weapon"
                  />
                </div>
              )}
              <div className="frame_set_part">
                <p className="frame_set_part_name">
                  {formattedData.potion.name}
                </p>
                <img
                  className="img_part"
                  src={formattedData.potion.img}
                  alt="Potion"
                />
              </div>
              <div className="frame_set_part">
                <p className="frame_set_part_name">
                  {formattedData.boots.name}
                </p>
                <img
                  className="img_part"
                  src={formattedData.boots.img}
                  alt="Boots"
                />
              </div>
              <div className="frame_set_part">
                <p className="frame_set_part_name">{formattedData.food.name}</p>
                <img
                  className="img_part"
                  src={formattedData.food.img}
                  alt="Food"
                />
              </div>
            </div>
          </div>
          <div className="personal_desc_div">
            <p className="personal_desc_div_nick">Создатель: {formattedData.nickname}</p>
           

            <p>Описание:</p>
            <p>{formattedData.description}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div className="main_personal_div_raiting">
        <div >
        <p>Оценить комплект : </p>
        <p className="main_personal_div_raiting_star" id="star_check"></p>
        {user?
        <div className="main_personal_div_raiting_btns">

        <button
          className="checkBox_raiting"
          id="check1"
         
          onClick={raitingHandlerGood}
          placeholder="1"
        >

        <label for="check1" title="+" >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30px"
            height="30px"
            viewBox="0 0 16 16"
            version="1.1"
            fill="none"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            
          >
            <path d="m5.25 5.75c1.5 0 3-4 4.5-4v4h4.5s-.5 7.5-3.5 7.5h-5.5z" />
            <path d="m5.25 5.75h-3.5v7.5h3.5" />
          </svg>
        </label>
        </button>
        <button
          className="checkBox_raiting"
          id="check2"
         
          onClick={raitingHandlerBad}
        >
        <label for="check2" title="-">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30px"
            height="30px"
            viewBox="0 0 16 16"
            version="1.1"
            fill="none"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          >
            <path d="m5.25 10.25c1.5 0 3 4 4.5 4v-4h4.5s-.5-7.5-3.5-7.5h-5.5z" />
            <path d="m5.25 10.25h-3.5v-7.5h3.5" />
          </svg>
        </label>

        </button>
        </div>
        :
        <Link to={'/profile'}>
        <p>Войдите в аккаунт чтобы оценить</p>
        </Link>
        }
        <p style={{marginLeft:'20px'}}>{`Raiting:${rait}`}</p>

        </div>
        {user?
        <div className="main_personal_div_voted">
          <p>Добавить в избранное</p>
          <button className="main_personal_div_voted_btn" id="btnVoted" onClick={fetchVote}>★</button>
        </div>:
        <div></div>
        }
      </div>
    </div>
  );
};
export default SetPage;
