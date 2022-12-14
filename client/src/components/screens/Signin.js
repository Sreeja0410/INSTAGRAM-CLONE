import React,{useState,useContext} from "react"
import {Link,useNavigate} from "react-router-dom"
import {UserContext} from "../../App"
import M from "materialize-css"

const Signin = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const navigate = useNavigate();
  const [password,setPassword] = useState("");
  const [email,setEmail] = useState("");
  const PostData = () =>{
    const em = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(em.test(email)===false){
      M.toast({html: "invalid email",classes:"#f44336 red"})
      return;
    }
    fetch("/signin",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        password,
        email
      })

    }).then(res=>res.json())
    .then(data=>{
      if(data.error){
        M.toast({html: data.error,classes:"#f44336 red"})
      }
      else{
        localStorage.setItem("jwt",data.token)
        localStorage.setItem("user",JSON.stringify(data.user))
        dispatch({type:"USER",payload:data.user})
        M.toast({html: "successfully signed in", classes:"#4caf50 green"})
        navigate("/");
      }
    })
    .catch(err=>{
      console.log(err);
    })
  }
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button onClick={()=>PostData()} className="btn waves-effect waves-light #2196f3 blue">login</button>
        <h5>
          <Link to="/Signup">Don't have an account?</Link>
        </h5>
      </div>

    </div>
  )
}

export default Signin
