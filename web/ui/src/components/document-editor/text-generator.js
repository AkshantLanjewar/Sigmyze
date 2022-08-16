function GenerateTextStyles(theme, tag) {
    let text_dict   = {}
    text_dict['p']  = { fontSize: theme.fontSizes.md }
    text_dict['h1'] = { fontSize: 34, fontWeight: 700 } 
    text_dict['h2'] = { fontSize: 26, fontWeight: 700 }
    text_dict['h3'] = { fontSize: 22, fontWeight: 700 }
    text_dict['h4'] = { fontSize: 18, fontWeight: 700 }
    text_dict['h5'] = { fontSize: 15, fontWeight: 700 }
    text_dict['h6'] = { fontSize: 14, fontWeight: 700 }


    let return_obj = { text: false }
    //check if tag is in list
    let keys = Object.keys(text_dict)
    if(keys.includes(tag)) {
        return_obj['styles'] = text_dict[tag]
        return_obj['text']   = true
    }

    return [return_obj, keys]
}

export default GenerateTextStyles