"use client"

import React, { useState, useContext } from 'react';
import AuthContext from '@/auth';
import Comment from './Comment';
import './CommentSection.css';

const CommentSection = ({ initialComments }) => {
    const { auth } = useContext(AuthContext);
    const [comments, setComments] = useState(initialComments);
    const [newCommentText, setNewCommentText] = useState('');

    const handleAddComment = () => {
        if (!auth.loggedIn) {
            alert("Please sign in");
            return;
        }

        // check for empty comment
        if(newCommentText.trim().length == 0)
        {
            alert("Cannot post empty comment.");
            return;
        }

        const newComment = {
            id: comments.length + 1,
            author: auth.user?.username,
            timestamp: 'Just now',
            text: newCommentText,
            replies: []
        };

        setComments([newComment, ...comments]);
        setNewCommentText('');
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAddComment();
            event.preventDefault(); // Prevents the default action of the Enter key in a form
        }
    };

    return (
        <div className="comments-section">
            <div className="comment-count">{comments.length} comments</div>
            {auth.loggedIn && (
                <div className="add-comment">
                    <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleAddComment}>Post</button>
                </div>
            )}
            {comments.map(comment => (
                <Comment key={comment.id} comment={comment} setComments={setComments} />
            ))}
        </div>
    );
};

export default CommentSection;
