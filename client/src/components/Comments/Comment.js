import React, { useState, useContext } from 'react';
import AuthContext from '../../auth';
import './Comment.css';

const Comment = ({ comment, setComments }) => {
  const { auth } = useContext(AuthContext);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  
  const handleReply = () => {
    if (!auth.loggedIn) {
      alert("Please sign in");
      return;
    }

    const newReply = {
      id: new Date().getTime(), 
      author: auth.user?.username,
      timestamp: 'A moment ago',
      text: replyText
    };
  
    setComments(currentComments =>
      currentComments.map(c =>
        c.id === comment.id ? { ...c, replies: [...c.replies, newReply] } : c
      )
    );
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
      <div className="comment-timestamp">{comment.timestamp}</div>
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
          <div className="comment-timestamp">{reply.timestamp}</div>
          <div className="comment-text">{reply.text}</div>
        </div>
      ))}
    </div>
  );
};

export default Comment;
