import React from "react"

type props = {
    postTitle: string,
    postDescription: string,
    postID: string
}

const Post: React.FC<props> = ({ postTitle, postDescription, postID }) => {
    return (
        <div className="post-view">
            <h3 className="post-title">{postTitle}</h3>
            <p>{postDescription}</p>
        </div>
    )
}

export default Post