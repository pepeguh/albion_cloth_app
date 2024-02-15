import "../styles/Header.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="main_header">
      <div className="header_home">
      <Link to="/" className="header_link">Home</Link>
      </div>
      <div className="header_mist">
      <Link to="/mist" className="header_link">Mists</Link>
      </div>
      <div className="header_gang">
        <Link to="/gang" className="header_link">Gank</Link> 
      </div>
      <div className="header_avatar">
        <Link to='/profile' className="header_avatar_link"> 
          {/* НАДО СДЕЛАТЬ ИФ ЭЛСЕ В ЗАВИСИМОСТИ ОТ АВТОРИЗАЦИИ, ТО ЕТСЬЬ В ЛЮБОМ СЛУЧАЕ НУЖЕН СТЕЙТ МЕНЕДЖЕР!!!! */}
        <span>?</span> 
        {/* <img src="https://avatars.cloudflare.steamstatic.com/6c5cf1124e9766c3bf2a2a45a5f15ef32459c091_full.jpg" /> */}
        </Link>
      </div>
    </div>
  );
};

export default Header;
