import React from "react"

import { BsPersonFill } from 'react-icons/bs'
import { MdAreaChart } from 'react-icons/md'
import { RiGovernmentFill } from 'react-icons/ri'
import { FaMoneyBill } from 'react-icons/fa'
import { GiTrade } from 'react-icons/gi'

const ICON_DICT = {
    GovtFinance: <RiGovernmentFill />,
    People: <BsPersonFill />,
    GDP: <MdAreaChart />,
    Investment: <FaMoneyBill />,
    Trade: <GiTrade />
}

export default ICON_DICT