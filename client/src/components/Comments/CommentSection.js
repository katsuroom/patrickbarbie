// CommentSection.js
import React, { useState } from 'react';
import Comment from './Comment.js';
import './CommentSection.css';

const CommentSection = ({ initialComments }) => {
  const [comments, setComments] = useState(initialComments);
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = () => {
    const newComment = {
      id: comments.length + 1,
      author: 'NewUser', // Replace with actual user data
      timestamp: 'Just now',
      text: newCommentText,
    };
    setComments([...comments, newComment]);
    setNewCommentText('');
  };

  return (
    <div className="comments-section">
      <div className="comment-count">{comments.length} comments</div>
      <div className="add-comment">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button onClick={handleAddComment}>Post</button>
      </div>
      {comments.map(comment => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
};

export default CommentSection;
