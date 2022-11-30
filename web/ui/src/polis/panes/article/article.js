import React   from 'react'
import { Box } from '@mantine/core'

import ArticleView from '../../../components/document-editor/presentation/article-view'

const Article = ({ article }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                height: '100%'
            }}
        >
            <Box
                sx={(theme) => ({ 
                    maxWidth: 1200,
                    width: '70%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center', 
                    background: theme.colors.dark[8],

                    borderRight: `2px solid ${theme.colors.dark[5]}`,
                    borderLeft: `2px solid ${theme.colors.dark[5]}`
                })}
            >
                {article === null
                    ? null
                    : ( <ArticleView 
                            article={article} 
                            official={true}
                        /> 
                    )
                }
            </Box>
        </Box>
    )
} 

export default Article