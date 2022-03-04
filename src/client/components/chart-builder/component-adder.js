import React, { useState } from "react"

function ComponentModal(props) {
    return (
        <div className="component-sidebar">
            <div className="header">
                <h5>Select Dataset</h5>
                <button className="close"></button>
            </div>

            <div className="body">
                <div className="dataset">
                    <div className="inner">
                        <div className="title">
                            <img src={"/logos/WEO.svg"} width={"70px"} height={"70px"} />
                            <h6>World Economic Outlook (WEO)</h6>
                        </div>

                        <div className="body">
                            <p>Indicator Description</p>
                        </div>
                    </div>
                </div>

                <div className="dataset">
                    <div className="inner">
                        <div className="title">
                            <img src={"/logos/WEO.svg"} width={"70px"} height={"70px"} />
                            <h6>World Economic Outlook (WEO)</h6>
                        </div>

                        <div className="body">
                            <p>Indicator Description</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer">
                <button>Continue</button>
            </div>
        </div>
    )
}

export default ComponentModal