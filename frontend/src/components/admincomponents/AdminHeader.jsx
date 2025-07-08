import React ,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'

import MenuItems from '../admincomponents/MenuItems.jsx'

export default function AdminHeader() {

const role = localStorage.getItem('role');
const MenuData = MenuItems[role] || []; 



     const [sidebarToggled, setSidebarToggled] = useState(false);





  useEffect(() => {
    if (window.innerWidth < 1200) {
      setSidebarToggled(true);
    }
  }, []);

  // Apply/remove body class based on state
  useEffect(() => {
    if (sidebarToggled) {
      document.body.classList.add('sidebar-toggle');
    } else {
      document.body.classList.remove('sidebar-toggle');
    }
  }, [sidebarToggled]);

  const handleToggle = () => {
    setSidebarToggled(!sidebarToggled);
  };

  return (
    <>
        <header className="header">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-9">
                        <div className="left-header">
                            <div className="logo-div me-5">
                                <Link to="/"><img src='/assets/images/logo/logo.png' style={{width:'100px'}}/></Link>
                            </div>
                            <span className="toggle-sidebar-btn  px-5 ms-5" onClick={handleToggle}>
        <i className="fa-solid fa-angle-left"></i>
        {/* <i class="fa-solid fa-bars"></i> */}
      </span>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="right-header">
                           <div>
                                <Link to="#" className="setting-link"><i className="fa-solid fa-bell text-primary "></i></Link>
                            </div>
                            <div>
                                <Link to="#" className="setting-link"><i className="fa-solid fa-gear text-primary "></i></Link>
                            </div>
                             
                            <div>
                                <div className="dropdown profile-dropdown-div">
                                    <Link className="dropdown-toggle" to="/" role="button" id="profile-dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src='/assets/images/admin/user-img.png' className="user-img" />
                                        <i className="fa-solid fa-angle-down"></i>
                                    </Link>

                                    <ul className="dropdown-menu" aria-labelledby="profile-dropdown">
                                        <li><Link className="dropdown-item" to="/"><i className="fa-light fa-user"></i> My Profile</Link></li>
                                        <li><Link className="dropdown-item" to="/"><i className="fa-regular fa-arrow-right-from-bracket"></i> Logout</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>

      <aside id="sidebar">
     
   <ul className="sidebar-nav">
  {(MenuData || []).map((item, idx) => (
    <li key={idx} className={`nav-item ${item.children ? 'menu-dropdown' : ''}`}>
      {item.children ? (
        <>
          <Link
            to="#"
            className="dropdown-menu-link dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <div>
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </div>
            <i className="fa-regular fa-angle-down"></i>
          </Link>
          <ul className="sub-menu dropdown-menu">
            {item.children.map((child, cIdx) => (
              <li key={cIdx}>
                <Link to={child.link}>{child.label}</Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Link to={item.link}>
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </Link>
      )}
    </li>
  ))}
</ul>

      <img src='/assets/images/admin/logo/footer-img.png' className='w-100'/>
    </aside>
    </>
  )
}
