"use client"

import React, { useState, useContext } from 'react';
import AuthContext from '@/auth';
import StoreContext from '@/store';
import './Comment.css';

const Comment = ({ comment, setComments, comments }) => {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(StoreContext);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const handleReply = () => {
    if (!auth.loggedIn) {
      alert("Please sign in");
      return;
    }

    // check for empty comment
    if(replyText.trim().length == 0)
    {
        alert("Cannot post empty comment.");
        return;
    }

    const newReply = {
      id: comment.replies.length + 1, 
      author: auth.user?.username,
      timestamp: new Date(),
      text: replyText,
    };
  
    setComments((currentComments) =>
      currentComments.map((c) =>
        c.id === comment.id ? { ...c, replies: [...c.replies, newReply] } : c
      )
    );

    comments = comments.map((c) =>
      c.id === comment.id ? { ...c, replies: [...c.replies, newReply] } : c
    );

    // console.log("comments: ", comments);

    var mapObject = store.currentMapObject;
    mapObject.comments = comments;
    // console.log(mapObject);
    store.updateMap(mapObject);

    setReplyText('');
    setShowReply(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleReply();
    }
  };

  
  return (
    <div className="comment">
      <div className="comment-author">{comment.author}</div>
      <div className="comment-timestamp">{comment.timestamp.toLocaleString()}</div>
      <div className="comment-text">{comment.text}</div>
      {auth.loggedIn && (
        <>
          <button className="comment-reply-btn" onClick={() => setShowReply(!showReply)}>Reply</button>
          {showReply && (
            <div className="comment-reply">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write a reply..."
              />
              <button onClick={handleReply}>Submit Reply</button>
            </div>
          )}
        </>
      )}
      {comment.replies && comment.replies.map(reply => (
        <div key={reply.id} className="comment-reply">
          <div className="comment-author">{reply.author}</div>
          <div className="comment-timestamp">{reply.timestamp.toLocaleString()}</div>
          <div className="comment-text">{reply.text}</div>
        </div>
      ))}
    </div>
  );
};

export default Comment;
