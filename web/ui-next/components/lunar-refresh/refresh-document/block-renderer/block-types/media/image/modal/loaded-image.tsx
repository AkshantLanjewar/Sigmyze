import { ThemeIcon, Group, ActionIcon, Progress, Text } from "@mantine/core"
import { IconPhoto, IconX } from "@tabler/icons"
import { IImageLoadState } from "."
import styles from './index.module.scss'

interface ILoadedImageProps {
    /**
     * This is the loaded image state, used when an image has been selected
     */
    imageLoad: IImageLoadState,

    /**
     * This is the function that resets the image in the modal
     */
    resetImage: () => void
}

const LoadedImage: React.FC<ILoadedImageProps> = ({ imageLoad, resetImage }) => {
    return (
        <div className={styles.loading__panel}>
            <ThemeIcon
                variant={'light'}
                color={'indigo'}
                size={'lg'}
                mt={imageLoad.loadingPercent === 100 ? -12.5 : -17.5}
            >
                <IconPhoto />
            </ThemeIcon>

            <div style={{ flexGrow: 1 }}>
                <Group position="apart">
                    <Text
                        weight={'bold'}
                        size={'md'}
                        sx={{ lineHeight: 1 }}
                    >
                        {imageLoad.title}
                    </Text>

                    <ActionIcon
                        size={'xs'}
                        variant={'subtle'}
                        onClick={() => { resetImage() }}
                    >
                        <IconX size={13} />
                    </ActionIcon>
                </Group>

                <Text
                    size={'sm'}
                    color={'dimmed'}
                >
                    {imageLoad.size.toFixed(2)}mb
                </Text>

                {imageLoad.loadingPercent !== 100 && (
                    <Progress 
                        radius={'xl'}
                        color={'cyan'}
                        value={imageLoad.loadingPercent}
                        striped
                        animate
                    />
                )}
            </div>
        </div>
    )
}

export default LoadedImage