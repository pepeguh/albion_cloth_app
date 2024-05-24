export const tierOptions = [
    { value: "T1_", label: "T1" },
    { value: "T2_", label: "T2" },
    { value: "T3_", label: "T3" },
    { value: "T4_", label: "T4" },
    { value: "T5_", label: "T5" },
    { value: "T6_", label: "T6" },
    { value: "T7_", label: "T7" },
    { value: "T8_", label: "T8" },
  ];
  export const resourseOptions = [
    {
      label: "Ресурсы",
      options: [
        { value: "WOOD", label: "Дерево" },
        { value: "ROCK", label: "Камень" },
        { value: "ORE", label: "Руда" },
        { value: "HIDE", label: "Шкура" },
        { value: "FIBER", label: "Хлопок" },
        // { value: "ARMOR_LEATHER_SET1", label: "НАЕМНИК" },
        // { value: "ARMOR_LEATHER_MORGANA", label: "ЛАЗУТКА" },
        // {value:'MAIN_NATURESTAFF_KEEPER', label:"Посох друида"}
      ],
    },
    {
      label: "Материалы",
      options: [
        { value: "PLANKS", label: "Доски" },
        { value: "STONEBLOCK", label: "Камменые блоки" },
        { value: "METALBAR", label: "Слитки" },
        { value: "LEATHER", label: "Кожа" },
        { value: "CLOTH", label: "Ткань" },
      ],
    },
  ];
export const enchantmentOptions = [
  {value:"", label:'0'},
  {value:"_LEVEL1@1", label:'1'},
  {value:"_LEVEL2@2", label:'2'},
  {value:"_LEVEL3@3", label:'3'},
  {value:"_LEVEL4@4", label:'4'}
]  
export const itemEnchantmentOptions=[
  {value:"", label:'0'},
  {value:"@1", label:'1'},
  {value:"@2", label:'2'},
  {value:"@3", label:'3'},
  {value:"@4", label:'4'}
]
export const itemQualityOptions=[
  {value:"&qualities=1", label:'Обычное'},
  {value:"&qualities=2", label:'Хорошее'},
  {value:"&qualities=3", label:'Выдающееся'},
  {value:"&qualities=4", label:'Отличное'},
  {value:"&qualities=5", label:'Шедевр'}
]