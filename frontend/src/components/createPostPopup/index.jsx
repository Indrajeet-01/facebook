import { useEffect, useRef, useState } from "react"
import "./style.css"
import Picker from "emoji-picker-react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds"
import AddToYourPost from "./AddToYourPost";
import useClickOutside from "../../helpers/clickOutside";
import ImagePreview from "./ImagePreview";
import { useDispatch } from "react-redux";
import { createPost } from "../../functions/post";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/uploadImages";
export default function CreatePostPopup({user,setVisible}) {
    const dispatch = useDispatch();
    const popup = useRef(null);
    const [text, setText] = useState("")
    const [showPrev, setShowPrev] = useState(true)
    const [loading, setLoading] = useState(false)
    const [images,setImages] = useState([])
    const [background, setBackground] = useState("")
    useClickOutside(popup, () => {
        setVisible(false);
      });
      const postSubmit = async () => {
        if (background) {
            setLoading(true)
            const res = await createPost(
                null,
                background, 
                text,
                null,
                user.id,
                user.token)
            setLoading(false)
            setBackground("")
            setText("")
            setVisible(false)
        } else if (images && images.length) {
            setLoading(true)
            const postImages = images.map((img) => {
                return dataURItoBlob(img)
            })
            const path = `${user.username}/post Images`
            let formData = new FormData()
            formData.append("path", path)
            postImages.forEach((image) => {
                formData.append("file", image)
            })
            const response = await uploadImages(formData,path,user.token)
            await createPost(null,null,text,response,user.id,user.token)
            setLoading(false)
            setText("")
            setImages("")
            setVisible(false)
        } else if (text) {
            setLoading(true)
            const res = await createPost(
                null,
                null, 
                text,
                null,
                user.id,
                user.token)
            setLoading(false)
            setBackground("")
            setText("")
            setVisible(false)
        } else {
            console.log("nothing")
        }

      }
    return (
        <div className="blur">
            <div className="postBox">
                <div className="box_header">
                    <div className="small_circle"
                        onClick={() => {
                            setVisible(false)
                        }}
                    >
                        <i className="exit_icon"></i>
                    </div>
                    <span>Create Post</span>
                </div>
                <div className="box_profile">
                    <img src={user?.picture} alt="" className="box_profile_img" />
                    <div className="box_col">
                        <div className="box_profile_name">
                            {user?.first_name} {user?.last_name}
                        </div>
                        <div className="box_privacy">
                            <img src="../../../icons/public.png" alt="" />
                            <span>Public</span>
                            <i className="arrowDown_icon"></i>
                        </div>
                    </div>
                </div>
                {!showPrev ? (
                    <>
                        <EmojiPickerBackgrounds 
                        text={text} 
                        user={user} 
                        setText={setText}  
                        showPrev={showPrev}
                        setBackground={setBackground}
                        background={background}
                        />
                    </>
                ) : (
                    <ImagePreview
                    text={text} 
                    user={user} 
                    setText={setText} 
                    images={images}
                    setImages={setImages}
                    showPrev={showPrev}
                    setShowPrev={setShowPrev}
                    />
                )}
                <AddToYourPost setShowPrev={setShowPrev}/>
                <button className="post_submit"
                    onClick={() => {
                        postSubmit()
                    }}
                >Post</button>
            </div>
        </div>
    )
}