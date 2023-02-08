import { 
    Header,
    Box,
    Burger,
    Group 
} from '@mantine/core'

import Image from 'next/image'
import { useRouter } from 'next/router'
import logo  from '../../public/logo.svg'

const HeaderS: React.FC<{}> = () : JSX.Element => {
    const router = useRouter()

    return (
        <Header height={60} px={'md'}>
            <Group position={'apart'}>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        height: 60,
                        cursor: 'pointer',
                        width: 'min-content' 
                    }}

                    onClick={() => { router.push('/') }}
                >
                    <Image 
                        src={logo} 
                        height={35} 
                        alt={"Sigmyze Logo"} 
                        style={{ marginRight: 5 }}
                    />

                    <Box 
                        sx={{
                            fontSize: 26,
                            fontWeight: 700,
                            textAlign: 'center',
                            fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif',
                            display: 'table-cell',
                            verticalAlign: 'middle'
                        }}
                    >
                        Sigmyze
                    </Box>
                </Box>
                
                <Group>
                </Group>
            </Group>
        </Header>
    )
}

export default HeaderS