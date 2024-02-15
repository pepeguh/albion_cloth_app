import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Profile.css";
const Profile = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail]= useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    
    // const check = document.getElementById('forUser');
    // if(!isAuth){
    //   check.style.display='none'
    // }else{
    //   check.style.display='block'
    // }
  }, [isAuth]);

  const checkHandler=(check)=>{
    setIsChecked(true)
    setIsRegistered(check)
  }
  const authHandler=(check)=>{
    setIsAuth(true)
  }

  return (
    <div className="main_profile_div">
      <div className="modul_div">
        {!isAuth?
        <div className="auth_div">
          {!isChecked?
          <div 
          style={{display:'flex', 
          flexDirection:'column',
          alignItems:'center',
        }}>
            <button onClick={()=>checkHandler(true)}>Авторизация</button>
            <button style={{marginTop:'10px'}} onClick={()=>checkHandler(false)}>Регистрация</button>
          </div>
          :
          <div>
            {isRegistered?
          <div className="login_div">
          <p>Авторизация</p>
          <input placeholder="Email"/>
          <input placeholder="Password" type="password"/>
          <button onClick={()=>authHandler()}>ОК</button>
          </div>
            :
          <div className="register_div">
          <p>Регистрация</p>
          <input placeholder="Email"/>
          <input placeholder="Password" type="password"/>
          <input placeholder="Password" type="password"/>
          <button onClick={()=>authHandler()}>ОК</button>
          </div>

          }

          </div>
          
        }

        </div>
        :
        <div id="forUser">
          <p>Мои комлекты:</p>
          <p>сюда что-то....</p>
          <Link to="/profile/creation">
            <p>Создать новый комплект</p>
          </Link>
        </div>
      
      }


      </div>
    </div>
  );
};
export default Profile;
