import React, {useEffect, useState} from "react";
import Post from "./components/Posts/Post";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import { db, auth} from "./firebase"
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
    const top = 50
    const left = 50

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
        paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {
    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle)
    const [posts, setPosts] = useState([])
    const [open, setOpen] = useState(false)
    const [openSignIn, setOpenSignIn] = useState(false)
    const [username, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser) {
                setUser(authUser)
            } else {
                setUser(null)
            }
        })

        return () => {
            unsubscribe()
        }

    },[user, username])

    useEffect(() => {
        db.collection('posts').orderBy("timestamp", "desc").onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })))
        })
    }, [])

    const signUp = (event) => {
        event.preventDefault()

                  auth
                 .createUserWithEmailAndPassword(email, password)
                 .then((authUser) => {
                     return authUser.user.updateProfile({
                         displayName: username
                     })
                 })
                 .catch((error) => alert(error.message) )

                    setOpen(false)

    }

    const signIn = (event) => {
        event.preventDefault()

        auth
            .signInWithEmailAndPassword(email,password)
            .catch((error) => alert(error.message) )

        setOpenSignIn(false)
    }

    return (
        <div className="app">
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signUp">
                            <p className="app__logo" >Socialize</p>
                        <Input
                            placeholder="username"
                            type="text"
                            value={username}
                            onChange={(e => setUserName(e.target.value))}
                        />
                        <Input
                            placeholder="email"
                            type="text"
                            value={email}
                            onChange={(e => setEmail(e.target.value))}
                        />
                        <Input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e => setPassword(e.target.value))}
                        />
                        <Button type="submit" onClick={signUp}>Sign In</Button>
                    </form>
                </div>
            </Modal>

            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signUp">
                            <p className="app__logo" >Socialize</p>
                        <Input
                            placeholder="email"
                            type="text"
                            value={email}
                            onChange={(e => setEmail(e.target.value))}
                        />

                        <Input
                            placeholder="password"
                            type="password"
                            value={password}
                            onChange={(e => setPassword(e.target.value))}
                        />
                        <Button type="submit" onClick={signIn}>Sign In</Button>
                    </form>
                </div>
            </Modal>

            <div className="app__header">
                <p className="app__logo --left" >Socialize</p>
                {user ? (
                    <Button  onClick={() => auth.signOut()}>Log Out</Button>
                ) : (
                    <div className="app__loginContainer">
                        <Button  onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button  onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                )}
            </div>

            <div className="app__posts">
                <div className="app__postsLeft">
                    {posts.map(({post,id})=> {
                        return <Post  key={id}
                                      postId={id}
                                      user={user}
                                      userName={post.username}
                                      imageUrl={post.imageUrl}
                                      caption={post.caption}
                        />
                    })}
                </div>

                <div className="app__postsRight">
                    <InstagramEmbed
                        url='https://instagr.am/p/Zw9o4/'
                        maxWidth={320}
                        hideCaption={false}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => {}}
                        onSuccess={() => {}}
                        onAfterRender={() => {}}
                        onFailure={() => {}}
                    />
                </div>

            </div>

            {user?.displayName ? (
                <ImageUpload username={user.displayName} />
            ) : (
                <h3 className="app__uploadInfo">Sorry you need to Log In to Upload</h3>
            )}
        </div>
  );
}

export default App;
