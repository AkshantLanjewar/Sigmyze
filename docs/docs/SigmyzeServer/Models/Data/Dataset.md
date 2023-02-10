# Dataset
This is the collection and schema for how datasets are stored in the database.

## Concept
The idea behind the dataset is central to the websites architechture.
All datasets can be split up and divided along 3 different lines.
The first is the dataset itself, whether it WEO, IMF, or even the Stock Market.
The next level down is the [object](./Object.md), objects within datasets can be like the United States, or the NASDAQ,
generally they are groupings of [indicators](./Indicator.md). 
The final level is the actual [indicators](./Indicator.md) themselves. They can be the GDP, or tickers within an exchange.

## Implementation
**[NOTE]**: The objects within the dataset are stored in the collection.
The schema for objects can be accessed [here](./Object.md). 
This implementation is what is extracted from the metadata.

```cs
public class Dataset
{
    public string Name { get; set; }

    public string Logo { get; set; } 
}
```

## Members

### Name (name)
`string`
> This is the name of the dataset, stored in 3 letter code format (ex: WEO)

### Logo (logo)
`string`
> This is the logo stored in base64 binary format
