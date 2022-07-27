import React,{useEffect,createContext,useReducer,useContext} from "react";
import NavBar from "./components/navbar"
import "./App.css"
import {BrowserRouter,Routes,Route,useNavigate} from "react-router-dom"
import Home from "./components/screens/Home"
import Profile from "./components/screens/Profile"
import Signin from "./components/screens/Signin"
import Signup from "./components/screens/Signup"
import CreatePost from "./components/screens/CreatePost"
import UserProfile from "./components/screens/UserProfile"
import MyFriendsPosts from "./components/screens/FriendsUserPosts"
import {reducer,initialState} from "./reducers/userReducer"

export const UserContext = createContext()

const Routing =()=>{
  const navigate = useNavigate()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    } else{
      navigate("/signin")
    }
    console.log(user);
  },[])
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/signin" element={<Signin />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/createpost" element={<CreatePost />} />
    <Route path="/profile/:userid" element={<UserProfile />} />
    <Route path="/myfriendsposts" element={<MyFriendsPosts />} />
    </Routes>
  )
}


function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <NavBar />
    <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
