import React from 'react';
import axios from "axios";
import { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { AuthContext } from "../helpers/AuthContext";



function Home() {
  //3: display the data we got from our (backend) api reqeust on website we need state
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  let history = useHistory(); //hooks that navigate and redirect to another palce in app
  const { authState } = useContext(AuthContext);

  //1-2:we use useEffect to write some logic when the page re-renders, we pass list of states wich will trigger function ro run again, //in order to prepare API requests we need to access our get() endpoint inside the routes(server)-we need axios
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      //making requests to our endpoints to backend
      axios.get("http://localhost:3001/posts",
        { headers: { accessToken: localStorage.getItem("accessToken") } })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });
    }
  }, []);

  const likedAPost = (postId) => {
    axios.post(
      "http://localhost:3001/likes",
      { PostId: postId },
      { headers: { accessToken: localStorage.getItem("accessToken") } }
    ).then((response) => {
      //here using map we modify just Likes list inside the post, keeping the same ...post, changing just Likes list
      setListOfPosts(
        listOfPosts.map((post) => {
          if (post.id === postId) {
            if (response.data.liked) {
              return { ...post, Likes: [...post.Likes, 0] };
            } else {
              const likesArray = post.Likes
              likesArray.pop();
              return { ...post, Likes: likesArray };
            }
          } else {
            return post;
          }
        })
      );

      if (likedPosts.includes(postId)) {
        setLikedPosts(
          likedPosts.filter((id) => {
            return id != postId;
          })
        );
      } else {
        setLikedPosts([...likedPosts, postId]);
      }
    });
  };

  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className='post'>
            <div className='title'> {value.title} </div>
            <div className='body' onClick={() => {
              history.push(`/post/${value.id}`);
            }}> {value.postText} </div>
            <div className='footer'>
              <div className='username'>
                <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
              </div>

              <div className='buttons'>
                <ThumbUpAltIcon onClick={() => {
                  likedAPost(value.id);
                }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />

                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        );

      })}

    </div>
  )
}

export default Home
