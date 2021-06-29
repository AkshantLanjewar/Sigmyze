import React, { RefObject } from "react"

import CarouselCard from './carousel-card'

interface State {
    chart_ref: RefObject<HTMLDivElement>
}

interface Props {

}

class ChartCarousel extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            chart_ref: React.createRef()
        }
    }

    render() {
        return (
            <div className="carousel_container">
                <div className="card_container">
                    <CarouselCard />
                </div>

                <div className="navigation_container">
                    <div className="dots">
                        <svg className="left-arrow">
                            <g><path d="m25.7 26.8l-2.3 2.3-10-10 10-10 2.3 2.4-7.7 7.6z" /></g>
                        </svg>

                        <div className="dot_container"><button></button></div>
                        <div className="dot_container"><button></button></div>
                        <div className="dot_container"><button></button></div>
                        <div className="dot_container"><button></button></div>

                        <svg className="right-arrow">
                            <g><path d="m14.3 27.3l7.7-7.7-7.7-7.7 2.3-2.3 10 10-10 10z" /></g>
                        </svg>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChartCarousel