# Polis
The polis object acts as an interactive page module for users.

## Concept
The eventual aim of the polis is to allow users to create interactive data easier.
Unlike static media that cant change, Polis's aim to create dynamic environments 
that can update and stream live data. The eventual aim is to be able to host polis's 
independently of the website as to allow for a more complete app.

## Implementation
```cs
public class Polis
{
    public string? PolisId { get; set; }

    public string? OrganizationId { get; set; }

    public Layout? ActiveLayout { get; set; }

    public PolisData? Data { get; set; }
}
```

## Members

### PolisId (polis_id)
`string?`
> Public access id for the polis

### OrganizationId (**hidden**)
`string?`
> This is the [organization](../Organization/organization-model.md) id so that the polis can refresh its data

### ActiveLayout (active_layout)
`Layout?`
> This [data structure](./layout.md) defines how the polis is to be visually presented (implement swappable layouts eventually)

### Data (data)
`PolisData?`
> This is all the [data](#polisdata-subclass) a layout might need to be displayed

## PolisData (subclass)
This object holds all the potential for a [layout](./layout.md).

### Implementation
```cs
public class PolisData
{
    public List<Article>? Articles { get; set; }
}
```

### Members

#### Articles (articles)
`List<Article>?`
> This is a list of published articles for the polis to draw from.
> Retrieved from the linked [organizations](../Organization/organization-model.md) published list.