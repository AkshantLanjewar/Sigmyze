import React, { useState, useEffect } from 'react'

import { 
    Card,
    Text,
    TextInput,
    Container,
    Table,
    UnstyledButton,
    Group,
    Center,
    Box,
    Modal 
} from '@mantine/core'

import { IoMdSearch }        from 'react-icons/io'
import { RiArrowUpDownFill } from 'react-icons/ri'

import { 
    HiChevronDown, 
    HiChevronUp 
} from 'react-icons/hi'

import useStyles from './published-manager.styles'

import { connect } from 'react-redux'

import PublishedManagerTr from './published-manager-tr'
import ArticleReview      from '../drive-components/drive-ui/modals/article-review'
import DeleteForm         from '../delete-form'

const Th = ({ children, reversed, sorted, onSort, sortable  }) => {
    const { classes } = useStyles()
    const Icon        = sorted ? ( reversed ? HiChevronUp : HiChevronDown ) : RiArrowUpDownFill

    return (
        <th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group position={'apart'}>
                    <Text weight={500} size={"sm"}>
                        {children}
                    </Text>

                    {sortable && (
                        <Center className={classes.icon}>
                            <Icon size={14} stroke={1.5} />
                        </Center>
                    )}
                </Group>
            </UnstyledButton>
        </th>
    )
}

function sortTable(data, reversed, search) {
    let n_data = [...data].sort((a, b) => {
        if(reversed)
            return b['published_title'].localeCompare(a['published_title'])
        return a['published_title'].localeCompare(b['published_title'])
    })

    return n_data
}

const PublishedManager = ({ drive }) => {
    const [search, setSearch]   = useState('')
    const [sortBy, setSortBy]   = useState(null)
    const [reverse, setReverse] = useState(false)

    //article preview
    const [previewOpened, setPreviewOpened]   = useState(false)
    const [previewArticle, setPreviewArticle] = useState(null)
    //delete article
    const [deleteOpen, setDeleteOpen] = useState(false)

    //row data
    const [dataView, setDataView]     = useState([])
    const [searchView, setSearchView] = useState([])

    function searchChange(e) {
        const { value } = e.currentTarget
        setSearch(value)
    }

    function setSorting(field) {
        let reversed = field === sortBy ? !reverse : false

        setReverse(reversed)
        setSortBy(field)
        setSearchView(sortTable(dataView, reverse, null))
    }

    function closePreview() {
        setPreviewOpened(false)
        setPreviewArticle(null)
    }

    function closeDelete() {
        setPreviewArticle(null)
        setDeleteOpen(false)
    }

    useEffect(() => {
        let published = drive.published

        setDataView([...published])
        setSearchView([...published])
    }, [drive])

    return (
        <Box>
            <ArticleReview
                opened={previewOpened}
                setOpened={(p) => { closePreview() }}
                article={previewArticle}
                hideControls={true}
            />

            <Modal
                opened={deleteOpen}
                title={`Delete Article`}
                centered
                onClose={() => { closeDelete() }}
            >
                {previewArticle !== null && (
                    <DeleteForm
                        title={previewArticle.published_title}
                        formType={"article"}
                        setOpened={() => { closeDelete() }}
                        article={previewArticle}
                    />
                )}
            </Modal>

            <Card 
                radius={"sm"} 
                shadow={"sm"} 
                withBorder
                sx={(theme) => ({ 
                    backgroundColor: theme.colors.dark[7],
                    overflow: 'visible' 
                })}
            >
                <Card.Section withBorder py={"xs"} inheritPadding>
                    <Text weight={500}>Published Content</Text>
                </Card.Section>

                <Card.Section>
                    <Container pt={"sm"} pb={'sm'}>
                        <TextInput
                            icon={<IoMdSearch size={14} stroke={1.5} />}
                            placeholder={"Search Article Name"}
                            mb={"md"}
                            value={search}
                            onChange={searchChange}
                            sx={(theme) => ({ backgroundColor: theme.colors.dark[9] })}
                        />

                        <Table
                            horizontalSpacing={"md"}
                            verticalSpacing={"xs"}
                            sx={{ tableLayout: 'fixed' }}
                        >
                            <thead>
                                <tr>
                                    <Th
                                        sortable={true}
                                        reversed={reverse}
                                        sorted={sortBy === 'name'}
                                        onSort={() => { setSorting('name') }}
                                    >
                                        Article Title
                                    </Th>

                                    <Th
                                        sortable={false}
                                        sorted={false}
                                        onSort={() => {  }}
                                    >
                                        Author
                                    </Th>

                                    <th />
                                    <th style={{ width: 100 }}></th>
                                </tr>
                            </thead>

                            <tbody>
                                {searchView.map((step) => (
                                    <PublishedManagerTr 
                                        article={step} 
                                        setArticle={setPreviewArticle}
                                        setPreviewOpened={setPreviewOpened}
                                        setDeleteOpen={setDeleteOpen}
                                    />
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </Card.Section>
            </Card>
        </Box>
    )
}

const mapStateToProps = state => ({
    drive: state.drive
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(PublishedManager)