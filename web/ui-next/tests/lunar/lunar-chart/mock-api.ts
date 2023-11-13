/**
 * here are all the individual functions that intercept routes and return mocked data
 */

import { Page, Route } from "@playwright/test"
import { IStatus } from "../../../components/data/datasets/DatasetsTypes"
import { IDatasetCard } from "../../../components/data/quanta/dataset-api"
import { IDatasetCacheObject } from "../../../components/ui/quanta-dataset-manager/types"

import mockPagedIndicators from './mock-resp/paged-indicators.json'
import mockPrimeDataset from './mock-resp/prime.json'

const quantaPublicPublishedDatasetsROUTE = async (page: Page) => {
    await page.route('*/**/api/v2/dataset/published/public', async (route: Route) => {
        //first we have to set up the API status
        const status: IStatus = {
            error: false,
            msg: "working"
        }

        //set up a list of dataset cards
        let datasetCards: IDatasetCard[] = []
        datasetCards.push({
            datasetName: "dummy-dataset",
            datasetId: "dummy-datasetID",
            description: "this is a phony description"
        })

        datasetCards.push({
            datasetName: "alternate",
            datasetId: "alternate-dataset",
            description: "alternate added for realism"
        })

        //now setup the response and send it
        let outputJSON = { status, datasetCards }
        await route.fulfill({ contentType: "application/json", body: JSON.stringify(outputJSON), status: 200 })
    })
}

const quantaSelectIndicatorLengthROUTE = async (page: Page) => {
    await page.route('*/**/api/v2/dataset/select/indicator_length', async (route: Route) => {
        //first we have to set up the API status
        const status: IStatus = {
            error: false,
            msg: "working"
        }

        let outputJSON = { status, length: 20 }
        await route.fulfill({ contentType: "application/json", body: JSON.stringify(outputJSON), status: 200 })
    })
}

const quantaSelectPagedIndicatorsROUTE = async (page: Page) => {
    await page.route('*/**/api/v2/dataset/select/indicator/20/0', async (route: Route) => {
        let outputJSON = mockPagedIndicators
        await route.fulfill({ contentType: "application/json", body: JSON.stringify(outputJSON), status: 200 })
    })
}

const quantaPrimeDatasetROUTE = async (page: Page) => {
    await page.route('*/**/api/v2/dataset/dummy-datasetID/prime', async (route: Route) => {
        let outputJSON = mockPrimeDataset
        await route.fulfill({ contentType: "application/json", body: JSON.stringify(outputJSON), status: 200 })
    })
}

export { 
    quantaPublicPublishedDatasetsROUTE, 
    quantaPrimeDatasetROUTE,
    quantaSelectIndicatorLengthROUTE,
    quantaSelectPagedIndicatorsROUTE 
}