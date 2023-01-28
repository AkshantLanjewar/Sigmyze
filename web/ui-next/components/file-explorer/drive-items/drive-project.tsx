import { IExplorerItem } from "../types"
import styles from '../file-explorer.module.scss'
import { Card, Title, Text } from "@mantine/core"
import { IconBox } from "@tabler/icons"

interface IDriveProjectProps {
    item: IExplorerItem,
    activeItem: string | null,
    setActiveItem: (id: string | null) => void
}

const DriveProject: React.FC<IDriveProjectProps> = ({ item, activeItem, setActiveItem }) => {
    return (
        <div 
            className={styles.file}
            onClick={() => { setActiveItem(item.item_id) }}
        >
            <Card
                component={"a"}
                shadow={"md"}
                href={"#"}
                radius={"md"}
                className={styles.file}
            >
                <Card.Section className={styles.icon}>
                    <div className={styles.inner}>
                        <IconBox />
                    </div>
                </Card.Section>

                <Card.Section className={`${styles.title} ${activeItem === item.item_id && styles.active}`}>
                    <Title order={4} mb={'xs'}>{item.item_name}</Title>
                    <Text
                        color='dimmed'
                        size={"xs"}
                        transform={"uppercase"}
                        className={styles.subtitle}
                    >
                        Lunar Project
                    </Text>
                </Card.Section>
            </Card>
        </div>
    )
}

export default DriveProject