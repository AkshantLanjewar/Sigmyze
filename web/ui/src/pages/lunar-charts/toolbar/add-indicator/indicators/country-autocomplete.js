import React from "react"

import {
    Group,
    Avatar,
    Text
} from "@mantine/core"

const AutoComplete = React.forwardRef(({ image, value, ...others }, ref) => (
    <div ref={ref} {...others}>
        <Group noWrap>
            <img width={24} height={16} src={image} />

            <div>
                <Text>{value}</Text>
            </div>
        </Group>
    </div>
))

export default AutoComplete