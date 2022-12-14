import React,{useEffect,useState,useContext} from "react"
import {UserContext} from "../../App"

const Profile = ()=>{

  const [mypics,setPics] = useState([])
  const {state,dispatch} = useContext(UserContext)
  const [image,setImage] = useState("");

  useEffect(()=>{
    fetch("/myposts",{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      console.log(result);
      setPics(result.myposts)
    })

  },[])

  useEffect(()=>{
    if(image){
      const data = new FormData()
      data.append("file",image)
      data.append("upload_preset","insta-clone")
      data.append("cloud_name","drueqxsxz")

      fetch("https://api.cloudinary.com/v1_1/drueqxsxz/image/upload",{
        method:"post",
        body:data
      }).then(res=>res.json())
      .then(data=>{
        // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
        // dispatch({type:"UPDATEPIC",payload:data.url})
        fetch("/updatepic",{
          method:"put",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
            pic:data.url
          })
        }).then(res=>res.json())
        .then(result=>{
          console.log(result);
          localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
          dispatch({type:"UPDATEPIC",payload:result.pic})
        })

      }).catch(err=>{
        console.log(err);
      })
    }
  },[image])


  const updatePhoto = (file)=>{
    setImage(file)

  }
  return (
    <div className="parent-div-profile">
    <div className="profile-p">
      <div className="profile">
        <div>
          <img className="profile-img" src={state?state.pic:"loading"} alt="" />

        </div>
        <div className="profile-head">
          <h4>{state?state.name:"loading"}</h4>
          <div className="profile-text">
            <h6>{mypics.length} posts</h6>
            <h6>{state?state.followers.length:"0"} followers</h6>
            <h6>{state?state.following.length:"0"} following</h6>
          </div>
        </div>
      </div>
      <div className="file-field input-field">
        <div className="btn #2196f3 blue btn-update">
          <span>update</span>
          <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>

      </div>
      <div className="gallery">
      {
        mypics.map(item=>{
          return(
            <img className="item" src={item.photo} alt=""/>
          )
        })
      }

      </div>
    </div>
  )
}

export default Profile
