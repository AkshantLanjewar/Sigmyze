# HomepageView
This is the default homepage view if the user is not authenticated.

## Implementation
```js
const DefaultPage = ({ userModalAction, user }) => {
    const [chartData, setChartData] = useState([]) 

    async function main() {
        ...
    }

    useEffect(() => {
        main()
    }, [])

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
> **Passed from Parent**

#### user
`reducerState`
> This is the current state for the UserReducer. <br />
> **Passed from Parent**

## State

#### chartData
`List<{ data, indicator, object }>`
> This is the list of demo charts that are meant to be displayed.
> passes the data, indicator, and object to the chart display card.

## Effects

#### `[]`
> This effect generates three charts as demo charts for the homepage to display.
> It just runs a simple function 3 times appending to an array, then it sets the 
> chartData state so that the ui can display them.

## Components

- **ChartCard**: This is a simple way of displaying indicators in a grid pattern.
- **FeatureCard**: This is how website features are promotionally displayed