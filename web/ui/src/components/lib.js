import { useRef, useEffect } from "react"

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value; //assign the value of ref to the argument
    }, [value]); //this code will run when the value of 'value' changes
    return ref.current; //in the end, return the current ref value.
}

function get(path, obj, fb = `$\{${path}}`) {
    return path.split('.').reduce((res, key) => res[key] || fb, obj)
}

function parseTpl(template, map, fallback) {
    return template.replace(/\$\{.+?}/g, (match) => {
        const path = match.substr(2, match.length - 3).trim()
        return get(path, map, fallback)
    })
}

export { usePrevious }
export { parseTpl }