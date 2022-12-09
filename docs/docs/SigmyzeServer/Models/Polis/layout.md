# Layout
This layout stores all the information relating to a polis's layout.

## Concept
The idea behind the layout is to be a container for all the different layout components.

## Implementation
```cs
public class Layout
{
    public string? LayoutId { get; set; }

    public List<LayoutPane>? Panes { get; set; }
}
```

## Members

### LayoutId (layout_id)
`string?`
> This is the id for the layout, to be used when layout swapping is created

### Panes (panes)
`List<LayoutPane>?`
> This is a list of the [panes](#layoutpane-subclass) used within the layout.

## LayoutPane (subclass)
This class aims to create the basic building block of the Polis, a Pane.
Pane's hold information relating to specific ui, and the actual pane type itself,
allowing for a portable method of storing layout data.

### Implementation
```cs
public class LayoutPane
{
    public string? PaneId { get; set; }

    public string? Title { get; set; }

    public string? FocusTitle { get; set; }

    public string? Subtitle { get; set; }
}
```

### Members

#### PaneId (pane_id)
`string?`
> Pane id correlates to the type of pane to be displayed.

#### Title (title)
`string?`
> Title container for potential panes to use

#### FocusTitle (focus_title)
`string?`
> Focus Title container for potential panes to use

#### Subtitle (subtitle)
`string?`
> Subtitle containerf or potential panes to use