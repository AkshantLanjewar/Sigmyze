/**
 * this is the container where all ui elements relating to the file
 * dropdown viewer are going to be rendered
 */
const fileDropdownContainerLocator = "file-dropdown-container"

/**
 * this is the base to find indexed folders within the file tree viewer
 * it is used in the format container-folder-[x], where x is the index
 */
const containerFolderBase = "container-folder"

/**
 * this is the base used to find indexed files within the file tree viewer
 * it is used in the format container-element-[x], where x is the index
 */
const containerElementBase = "container-element"

/**
 * this is the container where all of a folder's children are stored
 */
const folderChildrenLocator = "folder-children"

/**
 * this is the container where all the buttons in the button portal are 
 * rendered
 */
const buttonPortalLocator = "button-portal"

/**
 * this is the base to find indexed buttons within the button portal.
 * it is used in the format button-[x] where x is the index of the button
 */
const buttonBase = "button"

/**
 * this is the test-id for the icon within the folder create button,
 * use it to click on the button in a more precise manner
 */
const folderCreateLocator = "folder-create"

/**
 * this is the test-id for the icon within the folder-delete button,
 * use it to click on the button in a more precise manner
 */
const folderDeleteLocator = "folder-delete"

/**
 * this is the testId for the icon within the chart-add button
 */
const chartAddLocator = "chart-add"

/**
 * this is the testId for the icon within the chart-settings portal button
 */
const chartSettingsLocator = "chart-settings"

/**
 * this is the testId for the icon within the chart-remove portal button
 */
const chartRemoveLocator = "chart-remove"

/**
 * this is the testId for the icon within the note-setting portal button
 */
const noteSettingLocator = "note-setting"

/**
 * this is the testId for the icon within the note-delete portal button
 */
const noteDeleteLocator = "note-delete"

/**
 * this is the container where all the additional folder-create
 * menu buttons will be rendered
 */
const folderCreateMenuContainer = "folder-create-menu"

/**
 * this is the button that activates the new-folder form
 */
const newFolderButtonLocator = "new-folder"

/**
 * this is the button that activates the new-chart form
 */
const newChartButtonLocator = "new-chart"

/**
 * this is the button that activates the new note form
 */
const newNoteButtonLocator = "new-note"

/**
 * this is the locator for the cancel button in all generated forms
 */
const cancelButtonLocator = "cancel-button"

/**
 * this is the locator for the submit button in all generated forms
 */
const submitButtonLocator = "submit-button"

/**
 * this is the locator for the folder name input in the folder-create form
 */
const folderNameInputLocator = "folder-name"

/**
 * this is the locator for the chart name input in the chart-create form
 */
const chartNameInputLocator = "chart-name"

/**
 * this is the locator for the note name input in the note-create form
 */
const noteNameInputLocator = "note-name"

export {
    noteNameInputLocator,
    chartNameInputLocator,
    folderNameInputLocator,
    submitButtonLocator,
    chartRemoveLocator,
    chartSettingsLocator,
    chartAddLocator,
    folderDeleteLocator,
    folderCreateLocator,
    buttonPortalLocator,
    folderChildrenLocator,
    containerFolderBase,
    containerElementBase,
    buttonBase,
    cancelButtonLocator,
    newNoteButtonLocator,
    newChartButtonLocator,
    newFolderButtonLocator,
    noteDeleteLocator,
    noteSettingLocator,
    fileDropdownContainerLocator,
    folderCreateMenuContainer
}
