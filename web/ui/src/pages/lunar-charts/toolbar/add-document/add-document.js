import React from 'react'

import { useForm } from '@mantine/form'
import { 
    Modal, 
    Stack,
    TextInput,
    Container,
    Button 
} from '@mantine/core'

import { v4 as uuidv4 } from 'uuid'

import { connect }        from 'react-redux'
import { CreateDocument } from '../../../../data/actions/projectActions'

const AddDocument = ({ opened, setOpened, create_document }) => {
    const form = useForm({
        documentName: ""
    })

    function CreateDocument() {
        let n_document = {}

        n_document['document_id']       = uuidv4()
        n_document['document_name']     = form.values.documentName
        n_document['document_content']  = ""
        n_document['document_location'] = uuidv4()

        let location_schema = {
            document_id: n_document['document_id'],
            document_name: n_document['document_name'],
            document_content: n_document['document_content']
        }

        sessionStorage.setItem(n_document['document_location'], location_schema)
        create_document(n_document)
    }

    return (
        <Modal
            opened={opened}
            onClose={() => { setOpened(false) }}
            centered
            title={"Create Document"}
        >   
            <Container size={'md'}>
                <form 
                    onSubmit={(e) => { 
                        e.preventDefault()
                        
                        CreateDocument()
                        setOpened(false)
                    }}
                >
                    <Stack mb={"md"}>
                        <TextInput
                            label={"Document Title"}
                            placeholder={"Your Name"}
                            autoFocus
                            value={form.values.documentName}
                            onChange={(event) => form.setFieldValue('documentName', event.currentTarget.value)}
                        />

                        <Button type={"submit"}>Create</Button>
                    </Stack>
                </form>
            </Container>
        </Modal>
    )
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => ({
    create_document: (n_document) => {
        let document_id       = n_document['document_id']
        let document_name     = n_document['document_name']
        let document_content  = n_document['document_content']
        let document_location = n_document['document_location']

        dispatch(CreateDocument(document_id, document_name, document_content, document_location))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(AddDocument)