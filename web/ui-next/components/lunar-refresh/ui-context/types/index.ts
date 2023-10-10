type SynchroMessageType = "CREATE" | "DELETE"

/**
 * This is the type definition for a synchronization message between the UI and Data
 */
interface ISynchroMessage {
    /**
     * this is the unique id assigned to the message in order to differentiate messages
     */
    messageId: string,

    /**
     * this is the type of message
     * CREATE
     *  - this is a create message, meaning a file has been created
     * DELETE
     *  - this is a delete message, meaning a file has been deleted
     */
    messageType: SynchroMessageType,

    /**
     * this is the data in the message, each data has a unique format
     * 
     * CREATE
     *  - the raw data looks like -> file_type::file_name::file_id
     *  - the file_type is the type of file being created, either a note or chart
     *  - the file_name is the name of the file being created
     *  - the file_id is the file_id assigned to the SigmyzeFile that was created
     * DELETE
     *  TODO: Implement the delete functionality (later tests)
     */
    messageData: string
}



export type { ISynchroMessage }