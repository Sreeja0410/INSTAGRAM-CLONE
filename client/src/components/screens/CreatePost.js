import React,{useState,useEffect} from "react"
import {Link,useNavigate} from "react-router-dom"
import M from "materialize-css"

const CreatePost = ()=>{
  const navigate = useNavigate();
  const [title,setTitle] = useState("")
  const [body,setBody] = useState("")
  const [image,setImage] = useState("")
  const [url,setUrl] = useState("")
  useEffect(()=>{
    if(url){
      fetch("/createpost",{
        method:"post",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          title,
          body,
          url
        })

      }).then(res=>res.json())
      .then(data=>{
        if(data.error){
          M.toast({html: data.error,classes:"#f44336 red"})
        }
        else{
          M.toast({html: "successfully created post", classes:"#4caf50 green"})
          navigate("/");
        }
      })
      .catch(err=>{
        console.log(err);
      })
    }
  },[url])

  const postDetails = ()=>{
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset","insta-clone")
    data.append("cloud_name","drueqxsxz")

    fetch("https://api.cloudinary.com/v1_1/drueqxsxz/image/upload",{
      method:"post",
      body:data
    }).then(res=>res.json())
    .then(data=>{
      setUrl(data.url)
    }).catch(err=>{
      console.log(err);
    })

  }

  return (
    <div className="card input-field parent-div-create">
      <input
      type="text"
      placeholder="title"
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      />
      <input
      type="text"
      placeholder="body"
      value={body}
      onChange={(e)=>setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn #2196f3 blue">
          <span>Upload File</span>
          <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <div className="">
        <button onClick={()=>postDetails()} className="btn waves-effect waves-light #2196f3 blue">Create Post</button>
      </div>
    </div>
  )
}

export default CreatePost
