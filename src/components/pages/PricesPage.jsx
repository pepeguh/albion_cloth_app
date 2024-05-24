import React from "react";
import Select from "react-select";
import { useState, useEffect } from "react";
import {
  tierOptions,
  resourseOptions,
  enchantmentOptions,
  itemEnchantmentOptions,
  itemQualityOptions
} from "../elements/chooseOptions";
import "../styles/PricesPage.css";
import search_img from "../elements/search_img.svg";
import test2 from "../elements/items";
const PricesPage = () => {
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedEnchantment, setSelectedEnchantment] = useState(null);
  const [selecedQuality, setSelectedQuality] = useState(null)
  const [qualForImg,setQualForImg] = useState(null)
  const [findedItems, setFindedItems] = useState(null);

  const [itemsOption, setItemsOptions] = useState([])
  const [isRadioChecked, setIsRadioChecked] = useState(false);
  const baseUrl = "https://europe.albion-online-data.com/api/v2/stats/Prices/";
  const baseMidUrl = `.json?locations=Lymhurst,Fort Sterling,Bridgewatch,Martlock,Thetford,Caerleon,Brecilien`;
  const baseEndUrl = "&qualities=1";
  useEffect(()=>{
    if(isRadioChecked){
      let timedArr=[]
      test2.forEach((item)=>{
        timedArr.push({value:item.name.slice(3),label:item.ruName})
      })
      setItemsOptions(timedArr)
      
    }
  },[isRadioChecked])
  const radioHandler = () => {
    setIsRadioChecked(!isRadioChecked);
  };
  const startSearch = async () => {
    if (
      selectedEnchantment == null ||
      selectedItem == null ||
      selectedTier == null
    ) {
      return;
    }
    let result;
    let middleware = "";
    if(selecedQuality==null){

    }else{

      if(selecedQuality.label=='Обычное'){
        setQualForImg('')
      }else if(selecedQuality.label=='Хорошее'){
        setQualForImg('?quality=2')
      }else if(selecedQuality.label=='Выдающееся'){
        setQualForImg('?quality=3')
      }else if(selecedQuality.label=='Отличное'){
        setQualForImg('?quality=4')
      }else if(selecedQuality.label=='Шедевр'){
        setQualForImg('?quality=5')
      }
    }
    for (let i = 0; i < selectedItem.length; i++) {
      
        middleware =
          middleware +
          selectedTier.value +
          selectedItem[i].value +
          selectedEnchantment.value +
          ",";

     
       
    }
    try {
      if(isRadioChecked){
        result = await fetch(baseUrl + middleware + baseMidUrl + selecedQuality.value);

      }else{
        result = await fetch(baseUrl + middleware + baseMidUrl + baseEndUrl);
      }
      result = await result.json();
      console.log(selecedQuality)
      console.log(result);
      const filteredResult = result.filter(
        (item) => !(item.buy_price_max == 0 && item.sell_price_min == 0)
      );

      console.log(filteredResult);
      setFindedItems(filteredResult);
      middleware = "";
      console.log(`Максимальная цена автозакупа :${result[0].buy_price_max}
      Минимальная цена продажи:${result[0].sell_price_min}`);
    } catch (e) {
      console.error("Ошибка при поиске цен предмета:", e);
    }
  };

  return (
    <div>
      <div className="prices_all_top">
        <div className="prices_side">
          <div className="prices_search_div" >
            <div style={isRadioChecked?{display:'flex', flexDirection:'column'}:{display:'flex',flexDirection:'row'}}>
            <Select
              className="tier_select"
              options={tierOptions}
              //   styles={customTierStyles}
              maxMenuHeight={"720px"}
              onChange={(selectedOption) => setSelectedTier(selectedOption)}
              getOptionValue={(option) => option.value}
              placeholder="Выберите уровень"
            />
            <Select
              className="enchantment_select"
              options={isRadioChecked? itemEnchantmentOptions :enchantmentOptions}

              // isMulti
              maxMenuHeight={"720px"}
              //   styles={customResourseStyles}
              onChange={(selectedOption) =>
                setSelectedEnchantment(selectedOption)
              }
              placeholder="Выберите зачарование"
            />
              {
                isRadioChecked&&
                <Select
                 className="resourse_select"
   
                 options={itemQualityOptions}
                //  isMulti
                 maxMenuHeight={"720px"}
                 
                 //   styles={customResourseStyles}
                  onChange={(selectedOption) => setSelectedQuality(selectedOption)}
                 placeholder="Выберите качество"
               />
                

              }
            <Select
              className="resourse_select"

              options={isRadioChecked?itemsOption: resourseOptions}
              isMulti
              maxMenuHeight={"720px"}
              
              //   styles={customResourseStyles}
              onChange={(selectedOption) => setSelectedItem(selectedOption)}
              placeholder={isRadioChecked?"Выберите предмет":"Выберите ресурс"}
            />

            </div>
            <div className="search_div_img">
              <img
                src={search_img}
                className="search_img"
                onClick={startSearch}
              ></img>
            </div>

            <label>
              Поиск предметов
              <input
                style={{ marginLeft: "5px", width: "15px", height: "15px" }}
                type="radio"
                checked={isRadioChecked}
                onClick={() => radioHandler()}
              ></input>
            </label>
          </div>
        </div>
      </div>
      <div className="prices_all_bot" style={{ height: "200px" }}>
        {findedItems && (
          <div className="render_div">
            {findedItems.map((item, index) => (
              <div className="item_div" key={index}>
                <p
                  className={
                    item.city == "Fort Sterling" ? "Fort_Sterling" : item.city
                  }
                >
                  {item.city}
                </p>
                <div className="item_div_main">
                  <img
                    style={{ width: "40px", height: "40px" }}
                    src={isRadioChecked?`https://render.albiononline.com/v1/item/${item.item_id}${qualForImg}`:`https://render.albiononline.com/v1/item/${item.item_id}`}
                  ></img>
                  <div className="item_div_main_price">
                    {item.sell_price_min !== 0 && (
                      <div>
                        <p>Минимальная цена:{item.sell_price_min} </p>
                        <p>
                          ({item.sell_price_min_date.slice(8, 10)}.
                          {item.sell_price_min_date.slice(5, 7)}{" "}
                          {item.sell_price_min_date.slice(11, 16)})
                        </p>
                      </div>
                    )}
                    {item.buy_price_max !== 0 && (
                      <div>
                        <p>Максимальный ордер:{item.buy_price_max}</p>
                        <p>
                          ({item.buy_price_max_date.slice(8, 10)}.
                          {item.buy_price_max_date.slice(5, 7)}{" "}
                          {item.buy_price_max_date.slice(11, 16)})
                        </p>
                      </div>
                    )}
                    <p></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default PricesPage;
