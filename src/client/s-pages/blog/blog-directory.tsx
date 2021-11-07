import React, { useEffect, useState } from "react"

import Post from './post-view'
import Navbar from "../../components/navbar"

type BlogPostPack = {
    title: any,
    dateId: any,
    summary: any
}

function BlogDirectory() {
    let initalBlogPost = Array<BlogPostPack>()
    let [blogPosts, setPosts] = useState(initalBlogPost)

    useEffect(() => {
        let url = "/api/blog"
        fetch(url)
            .then(response => response.json())
            .then(data => {
                let pack = []
                
                for(let i = 0; i < data.length; i++) {
                    let obj = data[i]
                    pack.push({title: obj["title"], dateId: obj["date-id"], summary: obj["summary"]})
                }

                setPosts(pack)
            })
    }, [])

    return (
        <div>
            <Navbar />

            <div className="blog-container">
                <div className="blog-header">
                    <h1>Blog</h1>
                    <p>Below you will find articles on how to use the platofmr, to new developments, to updates we want to share with you</p>
                </div>

                <div className="posts">
                    {blogPosts.map((postData => <Post postTitle={postData.title} postDescription={postData.summary} postID={postData.dateId} />))}
                </div>
            </div>
        </div>
    )
}

export default BlogDirectory