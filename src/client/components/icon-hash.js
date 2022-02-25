import React from "react"

import { AiOutlineLineChart } from 'react-icons/ai'
import { GiMoneyStack } from 'react-icons/gi'
import { GiTrade } from 'react-icons/gi'
import { RiGovernmentLine } from 'react-icons/ri'
import { IoIosPeople } from 'react-icons/io'
import { FaVirus } from 'react-icons/fa'

const IconHash = {
    "GovtFinance": <RiGovernmentLine />,
    "People": <IoIosPeople />,
    "GDP": <AiOutlineLineChart />,
    "Investment": <GiMoneyStack />,
    "Trade": <GiTrade />,
    "Covid": <FaVirus />
}

export default IconHash