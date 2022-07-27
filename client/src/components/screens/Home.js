import React,{useState,useEffect,useContext} from "react"
import {UserContext} from "../../App"
import {Link} from "react-router-dom"

const Home = ()=>{

  const [data,setData] = useState([])
  const {state,dispatch} = useContext(UserContext)
  console.log(state);
  useEffect(()=>{
    fetch("/allpost",{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      //console.log(result);
      setData(result.allposts)
    })
  },[])

  const likePost = (id)=>{
    fetch("/likepost",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then(result=>{
      //console.log(result);
      const newData = data.map(item=>{
        if(item._id==result._id){
          return result
        } else{
          return item
        }
      })
      setData(newData)
    }).catch(err=>{
      console.log(err);
    })
  }

  const unLikePost = (id)=>{
    fetch("/unlikepost",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    }).then(res=>res.json())
    .then(result=>{
      //console.log(result);
      const newData = data.map(item=>{
        if(item._id==result._id){
          return result
        } else{
          return item
        }
      })
      setData(newData)
    }).catch(err=>{
      console.log(err);
    })
  }

  const makeComment = (text,postId)=>{
    fetch("/commentpost",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId,
        text
      })
    }).then(res=>res.json())
    .then(result=>{
      //console.log(result);
      const newData = data.map(item=>{
        if(item._id==result._id){
          return result
        } else{
          return item
        }
      })
      setData(newData)
    }).catch(err=>{
      console.log(err);
    })
  }


  const deletePost = (postid)=>{
    fetch("/deletepost/"+postid,{
      method:"delete",
      headers:{
        Authorization:"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{
      const newData = data.filter(item=>{
        return item._id !== result._id
      })
      setData(newData)
    })
  }

  const deleteComment = (commentid)=>{
    fetch("/deletecomment/"+commentid,{
      method:"delete",
      headers:{
        Authorization:"Bearer "+localStorage.getItem("jwt")
      }
    }).then(res=>res.json())
    .then(result=>{

      // const newData = data.filter(item=>{
      //   return item._id !== result._id
      // })
      // setData(newData)
    })
  }


  return (
    <div className="home">
    {
      data.map(item=>{
        return(

          <div className="card home-card" key={item._id}>
            <h5 className="profile-h"><Link to={item.postedBy._id!==state._id?"/profile/"+item.postedBy._id:"/profile"}>{item.postedBy.name}</Link>
            {item.postedBy._id==state._id
            &&
            <i className="material-icons" style={{float:"right"}} onClick={()=>deletePost(item._id)}>delete</i>
            }
            </h5>
            <div className="card-image">
              <img src={item.photo} alt="" />
            </div>
            <div className="card-content">
            <i className="material-icons home-icon"> favorite</i>
            {item.likes.includes(state._id)
            ?
            <i className="material-icons"
            onClick={()=>{unLikePost(item._id)}}
            >thumb_down</i>
            :
            <i className="material-icons"
            onClick={()=>{likePost(item._id)}}
            >thumb_up</i>
            }
            <h6> {item.likes.length} likes</h6>
              <h6> {item.title}</h6>
              <p>{item.body}</p>

              {item.comments.map(record=>{
                return(
                  <h6 key={record._id}>
                  {record.postedBy._id==state._id
                  &&
                  //onClick={()=>deleteComment(record._id)}
                  <i className="material-icons" >delete</i>
                  }

                  <span><b>{record.postedBy.name}</b></span> : {record.text}</h6>
                )
              })}

              <form onSubmit={(e)=>{
                e.preventDefault()
                console.log(e.target[0].value);
                makeComment(e.target[0].value,item._id)
              }}>
              <input type="text" placeholder="add a comment" />
              </form>

            </div>
          </div>
        )
      })
    }

    </div>
  )
}

export default Home
