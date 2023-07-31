import { Button } from "@mantine/core";
import { IconWorldDownload, IconWorldUpload } from "@tabler/icons";
import { SetStateAction, memo } from "react";

interface IViewProps {
    publishedState: boolean,
    setPublishOpen: (value: SetStateAction<boolean>) => void,
    setUnpublishOpen: (value: SetStateAction<boolean>) => void
}

const PublishButtonView: React.FC<IViewProps> = memo(({ publishedState, setPublishOpen, setUnpublishOpen }) => (
    publishedState
        ? (
            <Button
                radius={"xl"}
                color={"indigo"}
                onClick={() => setUnpublishOpen(true)}
            >
                <IconWorldDownload  
                    size={14} 
                    style={{ marginRight: 2.5 }} 
                    fill='white'
                    fillOpacity={1}
                />

                Unpublish
            </Button>
        )
        : (
            <Button
                radius={"xl"}
                color={"indigo"}
                onClick={() => setPublishOpen(true)}
            >
                <IconWorldUpload  
                    size={14} 
                    style={{ marginRight: 2.5 }} 
                    fill='white'
                    fillOpacity={1}
                />

                Publish
            </Button>
        )
))

export default PublishButtonView