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

function ImageSize(file, SetAspectWidth, setSize) {
    let imageUrl = file == null ? null : URL.createObjectURL(file)
    const img    = new Image()
    img.src      = imageUrl

    img.onload = function() {
        let n_prop = SetAspectWidth(this.width, this.height)
        setSize({ ...n_prop })
    }
}

async function AsyncGet(url, params) {
    const resp = await fetch(url, params)
    return await resp.json()
}

function GenerateInitials(username) {
    if(username == null)
        return ""

    let parts    = username.split(' ')
    let initials = ''

    for(let i = 0; i < parts.length; i++) {
        let part = parts[i]
        initials += part.charAt(0).toUpperCase()
    }

    return initials
}

function GetOrganization(organization_id, organizations) {
    let organization = null

    for(let i = 0; i < organizations.length; i++) {
        let organ = organizations[i]
        if(organ.organization_id === organization_id)
            organization = organ
    }

    return organization
}

function ImageBase64(file, setData) {
    var reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = function() {
        let result = reader.result
        setData(result)
    }
}

export { 
    ImageSize,
    usePrevious,
    parseTpl,
    capitalize,
    extractType,
    AsyncGet,
    GenerateInitials,
    GetOrganization,
    ImageBase64
}