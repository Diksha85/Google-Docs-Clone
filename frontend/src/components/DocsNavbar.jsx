import React from "react";
import Cookies from "js-cookie";
import "../styles/DocsHome.css";
import ThemeToggle from "../components/ThemeToggle";

export default function DocsNavbar() {
  const userName = Cookies.get("userName") || "U";

  return (
    <div className="docs-navbar">
      <div className="docs-menu-btn">☰</div>



      <div className="flex justify-center mb-6" >
  <div className="docs-logo bg-blue-500 rounded-full p-3 shadow-md hover:shadow-lg transition-shadow">
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAZlBMVEUwhvb9//8MZ9b///8mgvYcf/Z8sPmLtvn6/P/x9/4ieOewzvt5rfgohPaPvPoUbNucwvoAY9W5z/O+1PZmofhcnvh/s/mpxPAdb9kAWdawyfEnc9sAXtfI2fYwd9zM3vnc6PmnyftqlxHlAAABQklEQVR4nO3ZYVKDMBRF4ZpSRGvECKlaRdr9b9L3yxkrOCNJ7B17vhWcIUBfH6tVaa2bFdqn9ZTiTT9FuRAmq84bZVWPelEuPE9UnTvKhZe9XpSdYKcX5cLr6QkKRNm12utFueA6vajTZ1Ajyu6rTi/q6zOoEuXC26AX5cL7oBdlJzjoRVnVqBf1eYJSUfZmGPWibBYd9aLs3T7qRdl9NepFWdWhfNTtr7XlowAAAAAA+BeqTXZVapPvr7PrfWrU9tuHr2TbDFFXmRFFFFFEXURUk1mGqFhnF1OjJKcEAACgwFfZJU8uPu5yj1O75HlKdRwmiiiiiCJqQZTgdljxt49dAgAAmJGyS0geUebE+m6pOhYaUvyxuVmqedgUikqY0ddEEUUUURcctdyxUFTV3y/Xl/qDnrJLYGkAAAAAAAD+wgdWiT/hPWfjFwAAAABJRU5ErkJggg=="
      alt="Docs Logo"
      className="w-20 h-20"
    />
  </div>
</div>

     
      <div className="docs-search">
        <input type="text" placeholder="Search" />
      </div>

      
         <ThemeToggle />

         
      <div className="docs-avatar">{userName.charAt(0).toUpperCase()}</div>
    

    </div>
  );
}
