import React from "react"

type props = {
    postTitle: string,
    postDescription: string,
    postID: string
}

const Post: React.FC<props> = ({ postTitle, postDescription, postID }) => {
    return (
        <a href={"/post/" + postID} style={{textDecoration: "none"}}>
            <div className="post-view">
                <h3 className="post-title">{postTitle}</h3>
                <p>{postDescription}</p>
            </div>
        </a>
    )
}

export default Post