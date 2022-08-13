import React,{useEffect,useState,useContext} from "react"
import {UserContext} from "../../App"
import {useParams} from "react-router-dom"

const Profile = ()=>{
  const [userProfile,setProfile] = useState(null)

  const {state,dispatch} = useContext(UserContext)
  const {userid} = useParams()
  const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
  useEffect(()=>{
    fetch("/user/"+userid,{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{

      setProfile(result)
    })

  },[])

const followUser = ()=>{
  fetch("/follow",{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      followId:userid
    })

  }).then(res=>res.json())
  .then(data=>{
    //console.log(data);
    dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
    localStorage.setItem("user",JSON.stringify(data))
    setProfile((prevState)=>{
      return{
        ...prevState,
        user:{
          ...prevState.user,
          followers:[
            ...prevState.user.followers,data._id
          ]
        }
      }
    })
    setShowFollow(false)
  })
}

const unfollowUser = ()=>{
  fetch("/unfollow",{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      unfollowId:userid
    })

  }).then(res=>res.json())
  .then(data=>{
    //console.log(data);
    dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
    localStorage.setItem("user",JSON.stringify(data))
    setProfile((prevState)=>{
      const newFollower = prevState.user.followers.filter(item=>item!==data._id)
      return{
        ...prevState,
        user:{
          ...prevState.user,
          followers:newFollower
        }
      }
    })
    setShowFollow(true)
  })
}

  return (
    <>
    {userProfile?
      <div className="parent-div-profile">
        <div className="profile">
          <div>
            <img className="profile-img" src={userProfile.user.pic} alt=""/>
          </div>
          <div className="profile-head">
            <h4>{userProfile.user.name}</h4>
            <div className="profile-text">
              <h6>{userProfile.posts.length} posts</h6>
              <h6>{userProfile.user.followers.length} followers</h6>
              <h6>{userProfile.user.following.length} following</h6>
            </div>
            {
              showfollow?
              <button style={{margin:"10px"}}onClick={()=>followUser()} className="btn waves-effect waves-light #2196f3 blue">follow</button>
              :
                <button style={{margin:"10px"}}onClick={()=>unfollowUser()} className="btn waves-effect waves-light #2196f3 blue">unfollow</button>
            }

          </div>
        </div>
        <div className="gallery">
        {
          userProfile.posts.map(item=>{
            return(
              <img className="item" src={item.photo} alt=""/>
            )
          })
        }

        </div>
      </div>
       :
       <h2>loading...!</h2>
       }

    </>

  )
}

export default Profile
