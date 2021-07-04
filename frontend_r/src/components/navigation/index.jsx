import './navigation.scss'

function Navbar() {
    return (
        <div className="navbar">
            <h1 className="title">Lunar</h1>

            <ul className="nav_elements">
                <li class="element">About</li>
                <li class="element">Roadmap</li>
            </ul>
        </div>
    )
}

export default Navbar