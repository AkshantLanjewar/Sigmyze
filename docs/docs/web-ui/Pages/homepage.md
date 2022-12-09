# Homepage
The homepage is anchored to the index base url.
This page currently has two views, which switches based on the users authentication state.
If the user is not authenticated, 
it shows the **[HomepageView](./Views/homepage-view.md)**, 
otherwise it shows the **[DashboardView](./Views/dashboard-view.md)**

## Implementation
```js
const Homepage = ({ userModalAction, user }) => {
    const [homepageState, setHomepageState] = useState(false)

    useEffect(() => {
        ...
    }, [user])

    return (
        ...
    )
}
```

## Props

#### userModalAction
`function`
> This is a redux dispatch function, affecting the UserReducer.
> This function toggles the switch for the UserModal, which is the component the website
> generally uses to authenticate users. <br />
> **Passed from Redux**

#### user
`reducerState`
> This is the current state for the UserReducer. <br />
> **Passed from Redux**

## State

#### homepageState
`bool`
> This is the state deciding what view is to be displayed.
> True is dashboard and false is homepage.

## Effects

#### `[user]`
> This effect is called whenever the UserReducer state is updated.
> It checks to see whether or not the user is logged in or not.
> If the user is logged in, it will display the dashboard, otherwise it will display the default homepage.

## Components

- **[HomepageView](./Views/homepage-view.md)**: This is the view for the homepage
- **[DashboardView](./Views/dashboard-view.md)**: This is the view for the authenticated dashboard