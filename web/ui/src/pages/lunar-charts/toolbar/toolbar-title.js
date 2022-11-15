import React from "react";
import { Box, Text } from "@mantine/core";

const ToolbarTitle = ({ title }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                userSelect: 'none',
                paddingLeft: 15,
                paddingRight: 15,
                marginTop: 10,
                marginBottom: 10
            }}
        >
            <Text
                size={'xs'}
                color={'dimmed'}
                weight={600}
                transform={'uppercase'}
            >
                {title}
            </Text>
        </Box>
    )
}

export default ToolbarTitle