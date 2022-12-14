import React,{useContext,useRef,useEffect,useState} from "react"
import {Link,useNavigate} from "react-router-dom"
import {UserContext} from "../App"
import M from "materialize-css"

const NavBar = ()=>{
  const searchModal = useRef(null);
  const [search,setSearch] = useState("");
  const [userDetails,setUserDetails] =useState([])
  const navigate = useNavigate();
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])
  const renderList = ()=>{
    if(state){
      return [
        <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li key="2"><Link to="/profile"><i className="large material-icons" style={{color:"black"}}>person</i></Link></li>,
        <li key="3"><Link to="/createpost">Create Post</Link></li>,
        <li key="4"><img onClick={()=>{
          localStorage.clear()
          dispatch({type:"CLEAR"})
          navigate("/signin")
        }} src="out.webp" className="logout-img" alt="a" /></li>
      ]
    } else{
      return [
        <li key="5"><Link to="/signin">Login</Link></li>,
        <li key="6"><Link to="/signup">Signup</Link></li>,

      ]

    }
  }

  const fetchUsers = (query)=>{
    setSearch(query)
    fetch("/searchUser",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      console.log(results);
      setUserDetails(results.user)
      setSearch("")
    })
  }


  return(
    <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
      <ul id="nav-mobile" className="right">
        {renderList()}

      </ul>
    </div>
    <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
       <div className="modal-content">
         <input
           type="text"
           placeholder="search user"
           value={search}
           onChange={(e)=>fetchUsers(e.target.value)}
         />
         <ul className="collection">
         {userDetails.map(item=>{
           return <Link to={"/profile/"+item._id } onClick={()=>{
             M.Modal.getInstance(searchModal.current).close()
             setSearch("")
             setUserDetails([])
           }}><li className="collection-item">{item.name}</li></Link>
         })}
         </ul>
       </div>
       <div className="modal-footer">
         <button className="modal-close waves-effect waves-green btn-flat"
         onClick={
           ()=>{
             setSearch('')
         setUserDetails([])}}>close</button>
       </div>
     </div>
  </nav>
  )
}


export default NavBar
