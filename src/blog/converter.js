import showdown from 'showdown'

let opts = {
  omitExtraWLInCodeBlocks: true,
  noHeaderId: false,
  parseImgDimensions: true,
  simplifiedAutoLink: true,
  literalMidWordUnderscores: true,
  strikethrough: true,
  tables: true,
  tablesHeaderId: false,
  ghCodeBlocks: true,
  tasklists: true,
  smoothLivePreview: true,
  prefixHeaderId: false,
  disableForced4SpacesIndentedSublists: false,
  ghCompatibleHeaderId: true,
  smartIndentationFix: false
}

let converter = new showdown.Converter(opts)

export const convert = markdown => converter.makeHtml(markdown)
