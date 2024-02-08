/**
 * This is the locator for the root element in the document renderer
 */
const documentContainerLocator = "document-container"

/**
 * This is the base for a document block that is rendered within the document container
 */
const documentBlockBase = "document-block"

/**
 * This is the actual content of the block, whether it is text or an image
 */
const blockContentLocator = "block-content"

/**
 * This is the handle used to drag / reorder blocks within the editor
 */
const blockDragHandleLocator = "drag-handle"

/**
 * this is the container for the upload image modal
 */
const uploadImageModalLocator = "upload-image-modal"

/**
 * this is the locator for where the file is to be uploaded
 */
const uploadImageInputLocator = "upload-input"

/**
 * this is the cancel button for the upload image modal
 */
const uploadImageModalCancelLocator = "cancel-upload"

/**
 * This is the submit button for the upload image modal
 */
const uploadImageModalSubmitLocator = "submit-upload"

/**
 * This is the container for the add refresh chart flow
 */
const addRefreshChartLocator = "add-refresh-chart-modal"

/**
 * this is the cancel button for the refresh chart flow
 */
const addRefreshChartCancelLocator = "cancel-add"

/**
 * this is the submit button for the refresh chart flow
 */
const addRefreshChartSubmitLocator = "add-chart"

/**
 * This is the container where all the refresh chart options are rendered
 */
const addRefreshChartOptionsLocator = "refresh-chart-options"

/**
 * This is the base for a refresh chart option
 */
const addRefreshChartOptionBase = "refresh-chart"

/**
 * This is the wrapper for the context menu when it is activated
 */
const contextMenuLocator = "document-context-menu"

/**
 * This is the base for a context menu option
 */
const contextMenuOptionBase = "context-menu-opt"

/**
 * This is the div where all the context menu options are rendered
 */
const contextMenuOptionsLocator = "context-menu-options"

/**
 * when a block parent has a nested relationship, this is where the parent block is rendered
 */
const nestedTitleBlockLocator = "nested-title-block"

/**
 * where all the children of a nested block render
 */
const nestedChildrenLocator = "nested-children"

/**
 * This is the container for the documents topbar
 */
const documentTopbarLocator = "document-topbar"

/**
 * this is the base for an individual section within the topbar
 */
const documentTopbarSectionBase = "section"

/**
 * This is the button to turn the text node bold
 */
const textBoldButtonLocator = "text::bold"

/**
 * This is the dropdown that can change the type of text node
 */
const headingDropdownLocator = "heading-dropdown"

/**
 * This is the list of heading options the text node can transform into
 */
const headingItemsLocator = "heading-items"

/**
 * This is the base for a heading item within the headings menu
 */
const headingItemBase = "heading-item"

/**
 * The button to italicize a text node
 */
const italicizeLocator = "text::italic"

/**
 * The button to make a text strikethru
 */
const strikethruLocator = "text::strikethru"

/**
 * This is the button to make a text block align left
 */
const alignLeftLocator = "align::left"

/**
 * This is the button to make a text block align right
 */
const alignRightLocator = "align::right"

/**
 * This is the button to make a text block align center
 */
const alignCenterLocator = "align::center"

/**
 * The button to initiate the chart insertion flow
 */
const addChartLocator = "media::chart"

/**
 * The button to add an image to the document
 */
const addImageLocator = "media::image"

/**
 * The button to initiate the delete flow
 */
const deleteImageLocator = "delete-image"

/**
 * The modal containing the delete image flow
 */
const deleteImageModalLocator = "delete-image-modal"

/**
 * the button to initiate the delete chart flow
 */
const deleteChartLocator = "delete-chart"

/**
 * this is the modal containing the delete chart flow
 */
const deleteChartModalLocator = "delete-chart-modal"

/**
 * size handles for the image block
 */
const sizeHandlesLocator = "size-handles"

export {
    sizeHandlesLocator,
    deleteChartModalLocator,
    deleteChartLocator,
    deleteImageModalLocator,
    deleteImageLocator,
    addImageLocator,
    addChartLocator,
    alignCenterLocator,
    alignRightLocator,
    alignLeftLocator,
    strikethruLocator,
    italicizeLocator,
    headingItemBase,
    headingDropdownLocator,
    headingItemsLocator,
    textBoldButtonLocator,
    documentTopbarSectionBase,
    documentTopbarLocator,
    documentBlockBase,
    nestedChildrenLocator,
    nestedTitleBlockLocator,
    contextMenuOptionsLocator,
    contextMenuOptionBase,
    contextMenuLocator,
    addRefreshChartCancelLocator,
    addRefreshChartLocator,
    addRefreshChartOptionBase,
    addRefreshChartOptionsLocator,
    addRefreshChartSubmitLocator,
    uploadImageInputLocator,
    uploadImageModalCancelLocator,
    uploadImageModalLocator,
    uploadImageModalSubmitLocator,
    blockDragHandleLocator,
    blockContentLocator,
    documentContainerLocator
}