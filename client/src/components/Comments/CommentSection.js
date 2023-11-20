// CommentSection.js
import React, { useState, useContext } from 'react';
import AuthContext from '../../auth';
import Comment from './Comment';
import './CommentSection.css';

const CommentSection = ({ initialComments }) => {
    const { auth } = useContext(AuthContext);
    const [comments, setComments] = useState(initialComments);
    const [newCommentText, setNewCommentText] = useState('');

    const handleAddComment = () => {
        const newComment = {
            id: comments.length + 1,
            author: auth.user?.username,
            timestamp: 'Just now',
            text: newCommentText,
            replies: []
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
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Add a comment..."
                />
                <button onClick={handleAddComment}>Post</button>
            </div>
            {comments.map(comment => (
                <Comment key={comment.id} comment={comment} setComments={setComments} />
            ))}
        </div>
    );
};

export default CommentSection;
