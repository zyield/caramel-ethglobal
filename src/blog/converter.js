import showdown from 'showdown'

let converter = new showdown.Converter()

export const convert = markdown => converter.makeHtml(markdown)
