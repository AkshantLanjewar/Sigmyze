import { IQuantaIndicator } from "../../quanta/quanta-indicator-manager/types"

class QuantaFormattingEngine {
    indicator: IQuantaIndicator
    templateFields: { [key: string]: string }

    constructor(indicator: IQuantaIndicator) {
        this.indicator = indicator
        this.templateFields = {}

        this.constructFields()
    }

    public changeInicator(indicator: IQuantaIndicator) {
        this.indicator = indicator
        this.templateFields = {}

        this.constructFields()
    }

    private constructFields() {
        let fields = this.indicator.field?.datasetFields
        if(fields === undefined)
            return

        let parsedValues: { [key: string]: string } = {}
        for(let i = 0; i < fields.length; i++) {
            let field = fields[i]
            if(field.fieldKey === undefined || field.fieldType === undefined)
                continue

            //validate type based fields
            switch(field.fieldType) {
                case "string":
                    if(field.stringField === undefined)
                        continue

                    parsedValues[field.fieldKey] = field.stringField
                    break
                case "date":
                    if(field.dateField === undefined)
                        continue

                    let date = new Date(field.dateField * 1000)
                    parsedValues[field.fieldKey] = date.toLocaleDateString()
                    break
                default:
                    continue
            }
        }

        this.templateFields = parsedValues
    }

    public format(val: string) {
        const template = (tpl: string, args: { [key: string]: string }) => tpl.replace(/\${(\w+)}/g, (_, v) => args[v])
        return template(val, this.templateFields)
    }
}

export default QuantaFormattingEngine