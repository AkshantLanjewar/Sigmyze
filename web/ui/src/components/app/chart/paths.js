import * as d3 from 'd3'

function GenerateLinePath(opts) {
    function LinePath(x, y) {
        let line = d3.line()
                    .defined(d => !isNaN(d.value))
                    .x(d => x(d.date))
                    .y(d => y(d.value))

        return line
    }
    const x = opts['x']['x']
    const y = opts['y']['y']

    let path = LinePath(x, y)
    return path(opts['data']['data'])
}

export { GenerateLinePath }