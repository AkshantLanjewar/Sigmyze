class Observable {
    private value: any
    private valueChangedCallback: Function

    constructor(_value: any) {
        this.value = _value
        this.valueChangedCallback = () => false
    }

    setValue(val: any) {
        if(this.value != val) {
            this.value = val
            this.valueChangedCallback()
        }
    }

    getValue() {
        return this.value
    }

    onChange(callback: Function) {
        this.valueChangedCallback = callback
    }
}

export default Observable