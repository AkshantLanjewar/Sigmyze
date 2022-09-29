import { useRef, useEffect } from "react"

import { Tb3DCubeSphere } from 'react-icons/tb'

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

function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
}

const projectDictionary = [
    {
        name: "Lunar Project",
        id: "lunar",
        icon: <Tb3DCubeSphere size={22} />
    }
]

function extractType(type) {
    let info = null

    for(let i = 0; i < projectDictionary.length; i++) {
        let project = projectDictionary[i]
        if(project.id == type)
            info = project
    }

    return info
}

export { usePrevious }
export { parseTpl }
export { capitalize }
export { extractType }