import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../auth';
import Comment from './Comment';
import './CommentSection.css';
import StoreContext from "../../store";

const CommentSection = ({ initialComments }) => {
    const { store } = useContext(StoreContext);
    const { auth } = useContext(AuthContext);
    console.log("initialComments: ", initialComments);

    // Use the useEffect hook to update the state when initialComments changes
    useEffect(() => {
      setComments(initialComments);
    }, [initialComments]);

    const [comments, setComments] = useState(initialComments);
    console.log("comments: ", comments);
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

        console.log("now: ", new Date());

        const newComment = {
            id: comments.length + 1,
            author: auth.user?.username,
            timestamp: new Date(),
            text: newCommentText,
            replies: []
        };

        // setComments([newComment, ...comments]);

        // console.log("comments: ", comments);

        setComments((prevComments) => {
          const updatedComments = [newComment, ...prevComments];
          console.log("Updated comments:", updatedComments);

          // Call the function to update the database
          var mapObject = store.currentMapObject;
          mapObject.comments = updatedComments;
          console.log(mapObject);
          store.updateMap(mapObject);

          return updatedComments;
        });

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
                <Comment key={comment.id} comment={comment} setComments={setComments} comments={comments} />
            ))}
        </div>
    );
};

export default CommentSection;
