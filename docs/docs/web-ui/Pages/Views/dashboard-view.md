# Dashboard View
The dashboard view is the a wrapper for the drive component.
It is only allowed for users who are authenticated.

## Implementation
```js
const Dashboard = ({ user, drive, organization, updateDrive }) => {
    const [emptyDrive, setEmptyDrive] = useState(false)
    const [loading, setLoading]       = useState(false)

    function GrabDrive() {
        ...
    }

    useEffect(() => {
        GrabDrive()
    }, [])

    useEffect(() => {
        GrabDrive()
    }, [drive.update_drive])

    return (
        ...
    )
}
```

## Props

#### user
`reducerState`
> This is the current state for the UserReducer. <br />
> **Passed from Parent**

#### drive
`reducerState`
> This is the current state for the DriveReducer. <br />
> **Passed from Redux**

#### organization
`reducerState`
> This is the current state for the OrganizationReducer. <br />
> **Passed from Redux**

#### updateDrive
`function`
> This is the function that updates the DriveReducer with all the drive's data. <br />
> **Passed from Redux**

## Functions

#### GrabDrive()
`null`
> This is the function that retreives the drive from the API.
> It performs this by running the LoadDrive Utility.

## Effects

#### `[]`, `[drive.update_drive]`
> Runs the `GrabDrive()` function