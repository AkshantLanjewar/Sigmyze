import BlogHeader       from "./panes/blog-header/blog-header"
import BlogMainArticle  from "./panes/blog-main-article/blog-main-article"
import BlogArticleBlock from "./panes/blog-article-block/blog-article-block"
import Article          from "./panes/article/article"

function ExtractData(data, polisData, pane_id) {
    let article  = null
    let articles = []

    if('articles' in polisData)
        articles = polisData['articles']

    switch(pane_id) {
        case "main-article":
            if('articles' in polisData && articles.length > 0)
                article = articles.shift()
            
            data['main-article'] = article
        case "article-block":
            data['article-block'] = articles
        case "article":
            if(!('dataId' in data))
                return

            let articleId = data['dataId']
            for(let i = 0; i < articles.length; i++) {
                let t_article = articles[i]
                if(t_article.published_id == articleId)
                    article = t_article
            }

            data['article'] = article
    }

    polisData['articles'] = articles
}

const PREBUILT_LAYOUTS = {
    "published": [
        {
            "pane_id": "article"
        }
    ]
}

function PrebuiltLayouts(layout_type) {
    let layout = []
    if(layout_type in PREBUILT_LAYOUTS)
        layout = PREBUILT_LAYOUTS[layout_type]
    
    return layout
}

function ExtractPane(data, pane) {
    let pane_id = pane.pane_id
    let polisId = data['polisId']

    switch(pane_id) {
        case "blog-header":
            let title       = pane['title']
            let focus_title = pane['focus_title']
            let subtitle    = pane['subtitle']

            return (
                <BlogHeader
                    title={title}
                    focusTitle={focus_title}
                    subtitle={subtitle}
                />
            )
        case "main-article":
            let mainArticle = data['main-article']
            return (
                <BlogMainArticle 
                    article={mainArticle} 
                    polisId={polisId}
                />
            )
        case "article-block":
            let articleData = data['article-block']
            return (
                <BlogArticleBlock 
                    articles={articleData} 
                    polisId={polisId}
                />
            )
        case "article":
            return ( <Article article={data['article']} /> )
        default:
            return null
    }
}

export { 
    ExtractData,
    ExtractPane,
    PrebuiltLayouts 
}