
import { useSelector } from "react-redux";
import Header from "../../components/header";

import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories";
import "./style.css"
import CreatePost from "../../components/createPost";
import SendVerification from "../../components/home/sendVerification";


export default function Home({setVisible,posts}) {
  const {user} = useSelector((user) => ({...user}))
  return (
    <div className="home">
      
      <Header/>
      <LeftHome user={user}/>
      <div className="home_middle">
        <Stories/>
        {user.verified === false && <SendVerification user={user} />}
        <CreatePost user={user} setVisible={setVisible} />
      </div>
      <RightHome user={user}/>
    </div>
    )
}
