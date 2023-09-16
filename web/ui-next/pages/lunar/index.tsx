import LunarRefresh from "../../components/lunar-refresh/page"
import { ISigmyzeFilesystem } from "../../components/ui/file-management/types"
export const DefaultIndicatorTable = {
    weo: "USA"
}

interface ILunarProps {
}

const mockFilesystem: ISigmyzeFilesystem = {
    name: "Mock Filesystem",
    folders: [{
        folderId: 'dummy-folder',
        folderName: "Dummy Folder",
        folders: [],
        files: []
    }],
    files: [{
        fileId: "dummy-file",
        fileName: "Dummy Chart",
        fileType: "quanta::chart"
    }]
}

const Lunar: React.FC<ILunarProps> = ({  }) => {
    return (
        <div>
            <LunarRefresh />
        </div>
    )
}

export type { ILunarProps }
export default Lunar