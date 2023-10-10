import { test, expect } from '@playwright/experimental-ct-react'
import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/next-13'

/**
 * NOTE: The goal of this test is to test the basic functionality of a chart. The testing should cover theese core features:
 *  1. The name of the chart updating its file name in the editor, and in the sidebar
 *  2. A basic settings modal that can change the name of the chart
 *  3. a x-axis is rendered
 *  4. a y-axis is rendered
 *  5. debug-mode is true so a default chart renders
 *  6. x-axis contains September
 *  7. y-axis contains 6
 * 
 * [Title Test]: This test will cover all the tests related to the title of the chart
 *  - click button-0
 *  - page get new chart button
 *  - click new chart button
 *  - validate chart-name = New Folder Name
 *  - type in swag
 *  - click submit button
 *  - refresh-chart is attached
 *  - refresh-chart has a child chart-title which is attached
 *  - chart-title has text (swag)
 *  - click on chart-title
 *  - get chart-title-input
 *  - type Dummy Chart Title
 *  - click on viewport-tabs
 *  - file-dropdown-container has container-element-0 = Dummy Chart Title
 * 
 * [Chart Render Test]: 
 *  - click button-0
 *  - page get new chart button
 *  - click new chart button
 *  - validate chart-name = New Folder Name
 *  - type in swag
 *  - click submit button
 *  - x-axis is attached
 *  - x-axis contains september
 *  - y-axis is attached
 *  - y-axis contains 6
 */