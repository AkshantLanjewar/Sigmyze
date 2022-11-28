import React, { useState, useEffect } from 'react'

import DocumentAuthor from '../../../../components/document-editor/presentation/document-author'

import { 
    Menu,
    ActionIcon 
} from '@mantine/core'

import { 
    TbSettings,
    TbEye,
    TbTrash 
} from 'react-icons/tb'

const PublishedManagerTr = ({ article, setArticle, setPreviewOpened, setDeleteOpen }) => {
    const [author, setAuthor] = useState({ name: "", date: new Date() })

    useEffect(() => {
        let uname = article['public_user']['username']
        let date  = new Date(article['published_date'])

        setAuthor({ name: uname, date: date })
    }, [article])

    function preview() {
        setArticle(article)
        setPreviewOpened(true)
    }

    function delete_article() {
        setArticle(article)
        setDeleteOpen(true)
    }

    return (
        <tr>
            <td>{article.published_title}</td>
            <td>
                <DocumentAuthor author={author} />
            </td>
            
            <td></td>
            <td>
                <div 
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center' 
                    }}
                >
                    <Menu 
                        shadow={"md"} 
                        withArrow
                        position={'bottom'}
                        width={200}
                    >
                        <Menu.Target>
                            <ActionIcon
                                variant={'outline'}
                                color={'cyan'}
                            >
                                <TbSettings size={18} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item icon={<TbEye />} onClick={preview}>
                                Preview
                            </Menu.Item>

                            <Menu.Divider />

                            <Menu.Label>Danger</Menu.Label>
                            <Menu.Item
                                color={'red'}
                                icon={<TbTrash />}
                                onClick={delete_article}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </div>
            </td>
        </tr>
    )
}

export default PublishedManagerTr