import { UserContextData } from "../data/user/context"
import { IUserContext } from "../data/user/types"
import UserDropdown from "./user-dropdown/user-dropdown"
import { useContext, useState } from 'react'
import { Button } from "@mantine/core"
import ModalManager from "../modal-manager"
import LoginForm from "./forms/login-form"
import SignupForm from "./forms/signup-form"

const UserButton: React.FC = ({ }) => {
    const { loggedIn } = useContext(UserContextData) as IUserContext
    const [modalState, setModalState] = useState<string | null>(null)

    const closeModal = () => setModalState(null)
    const switchModal = (id: string) => setModalState(id)

    return (
        <div>
            {loggedIn
                ? <UserDropdown />
                : (
                    <Button 
                        color={'indigo'} 
                        onClick={() => setModalState("login-modal")}
                    >
                        Login
                    </Button>
                )
            }

            <ModalManager 
                modalState={modalState}
                close={closeModal}
            >
                <ModalManager.Modal
                    title={'Login'}
                    id={'login-modal'}
                >
                    <LoginForm 
                        switchModal={switchModal} 
                        closeModal={closeModal}
                    />
                </ModalManager.Modal>

                <ModalManager.Modal
                    title={'Signup'}
                    id={'signup-modal'}
                >
                    <SignupForm 
                        switchModal={switchModal} 
                        closeModal={closeModal}
                    />
                </ModalManager.Modal>
            </ModalManager>
        </div>
    )
}

export default UserButton