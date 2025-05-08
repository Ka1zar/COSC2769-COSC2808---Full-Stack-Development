import React from "react";
import styles from "./DiscussionBoard.module.css"; // Import CSS module

// DiscussionBoard component props:
// - eventId: The ID of the event the discussion belongs to
// - discussions: An array of comment objects { _id, author, text, createdAt }
// - loading: Boolean indicating if discussions are currently loading
// - error: String containing an error message if loading failed
// - newComment: The current value of the new comment input
// - onCommentChange: Function to update the new comment input state
// - onPostComment: Function to handle posting a new comment
const DiscussionBoard = ({
    eventId,
    discussions,
    loading,
    error,
    newComment,
    onCommentChange,
    onPostComment,
}) => {

    // Function to handle posting comment when button is clicked
    const handlePostClick = () => {
        // Call the parent's post comment function, passing the eventId
        onPostComment(eventId);
    };

    return (
        <div className={styles.discussionBoard}>
            <h3>Discussion</h3>

            {/* Display loading, error, or discussion list */}
            {loading ? (
                <div className={styles.loading}>Loading discussion...</div>
            ) : error ? (
                <div className={styles.error}>{error}</div>
            ) : discussions && discussions.length > 0 ? (
                <ul className={styles.discussionList}>
                    {discussions.map(comment => (
                        // Assuming comment has _id, author, text, createdAt
                        <li key={comment._id} className={styles.commentItem}>
                            <div className={styles.commentMeta}>
                                {/* Use author name if available, default to Anonymous */}
                                <span className={styles.commentAuthor}>{comment.author || 'Anonymous'}</span>
                                {/* Format the timestamp */}
                                <span className={styles.commentTime}>({new Date(comment.createdAt).toLocaleString()})</span>
                            </div>
                            <p className={styles.commentText}>{comment.text}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                // Empty state when there are no comments
                <div className={styles.emptyState}>No comments yet. Be the first to comment!</div>
            )}

            {/* Add new comment section */}
            <div className={styles.newCommentSection}>
                <textarea
                    className={styles.commentInput}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={onCommentChange} // Update state in parent component
                />
                {/* Button to post the comment */}
                <button
                    className={`${styles.button} ${styles.postCommentBtn}`}
                    onClick={handlePostClick} // Call local handler
                    disabled={loading} // Disable button while loading (optional)
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default DiscussionBoard;
