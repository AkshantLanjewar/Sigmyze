import React, { useState } from "react"

import '../sass/carousel.scss'

import { BiRightArrow, BiLeftArrow } from 'react-icons/bi'

type State = {
    children: Array<React.ReactNode>,

    indexs: Array<number>
}

type Props = {
    displayCount?: number
}

const Carousel: React.FC<Props> = ({ children, displayCount = 3 }) => {

    let initalState: State = {
        children: React.Children.toArray(children),
        indexs: []        
    }

    for(let i = 0; i < displayCount; i++)
        initalState.indexs.push(i)

    const [state, setState] = useState(initalState)

    let displayChildren = []
    for(let i = 0; i < state.indexs.length; i++)
        displayChildren.push(state.children[state.indexs[i]])

    function ArrowClick(dir: "left" | "right") {
        if(dir == "left") {
            let array = state.indexs

            for(let i = 0; i < array.length; i++) {
                let number = array[i]

                if(number - 1 < 0)
                    number = state.children.length - 1
                else
                    number = number - 1
                array[i] = number
            }

            setState({...state, indexs: array})
        }

        if(dir == "right") {
            let array = state.indexs

            for(let i = 0; i < array.length; i++) {
                let number = array[i]

                if(number + 1 > state.children.length - 1)
                    number = 0
                else
                    number = number + 1
                array[i] = number
            }

            setState({...state, indexs: array})
        }
    }
    
    return (
        <div className="carousel">
            <BiLeftArrow className="arrow" onClick={() => { ArrowClick("left") }} />

            <div className="children">
                {displayChildren}
            </div>
            
            <BiRightArrow className="arrow" onClick={() => { ArrowClick("right") }} />
        </div>
    )
}

export default Carousel