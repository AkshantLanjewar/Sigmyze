# Root Reducer
This combines all the reducers into a single accessable structure from redux.

## Implementation
```js
let reducers = combineReducers({
    user: userReducer,
    lunar: lunarReducer,
    project: projectReducer,
    drive: driveReducer,
    organization: organizationReducer
})
```

## Members
- `user`: **[UserReducer](./Reducers/UserReducer.md)** -> this is the reducer concerning user state
- `lunar`: **[LunarReducer](./Reducers/LunarReducer.md)** -> this is the reducer for lunar (idk might be deprecated)
- `project`: **[ProjectReducer](./Reducers/ProjectReducer.md)** -> this is the reducer concerning the project state
- `drive`: **[DriveReducer](./Reducers/DriveReducer.md)** -> This is the reducer concerning drive state
- `organization`: **OrganizationReducer** -> this is the reducer concerning organization state