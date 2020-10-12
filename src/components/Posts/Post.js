import React, {useEffect, useState} from 'react'
import "./Posts.css"
import {Avatar} from "@material-ui/core";
import { db } from "../../firebase"
import firebase from "firebase"

const Posts = ({postId, userName,imageUrl,caption, user}) => {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe
        if(postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })

            return () => {
                unsubscribe()
            }

        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault()

        db.collection('posts').doc(postId).collection("comments")
            .add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        setComment('')
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar"
                        src="https://digitaltaxi.net/images/user_2.png"
                        alt="user"/>
                <h3>{userName}</h3>
            </div>
            <img src={imageUrl}
                 className="post__img"
                 alt=""/>
            <h4 className="post__text"><strong>{userName}:</strong> {caption}</h4>

            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>

            {user && (
                <form className="post__commentBox" >
                    <input
                        type="text"
                        className="post__input"
                        placeholder="Add a comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}

        </div>
    )
}

export default Posts