// Comment.js
import React from 'react';
import './Comment.css'; 

const Comment = ({ author, timestamp, text }) => (
  <div className="comment">
    <div className="comment-header">
      <span className="comment-author">{author}</span>
      <span className="comment-timestamp">{timestamp}</span>
    </div>
    <div className="comment-text">{text}</div>
    <button className="comment-reply-btn">Reply</button>
  </div>
);

export default Comment;
