import React from "react";
import { useParams } from "react-router-dom";
const SetPage = ()=>{
    const {setId} = useParams();
    console.log(setId)
    let timeSet = setId.split('_')
    let nameSet = [...timeSet]
    let idSet = [...timeSet]
    nameSet.splice(0,1)
    nameSet = nameSet.join(' ')
    idSet.splice(1,99)
    idSet = idSet.join(' ')
    return(
        <div>
        <h1>Set Page</h1>
      <p>ID:{idSet} </p>
      <p>Name:{nameSet} </p>
        </div>
    )
}
export default SetPage