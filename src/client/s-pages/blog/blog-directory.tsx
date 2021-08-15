import React from "react"
import Navbar from "../../components/navbar"

function BlogDirectory() {
    return (
        <div>
            <Navbar />

            <div className="blog-wrap">
                <div className="header"></div>

                <div className="posts"></div>
            </div>
        </div>
    )
}

export default BlogDirectory