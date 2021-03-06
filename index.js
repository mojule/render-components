'use strict'

const is = require( '@mojule/is' )
const domUtils = require( '@mojule/dom-utils' )
const Templating = require( '@mojule/templating' )
const getTemplates = require( './src/get-templates' )
const getValues = require( './src/get-values' )

const { select } = domUtils

const excludeStrict = [ 'if', 'not', 'some', 'include' ]
// until we figure out what the weird thing with onInclude adding content is, don't use cache
const useCache = false

const Render = ( components, options ) => {
  const {
    getContent, getTemplate, getConfig, getStyle, getClient, getModel
  } = getValues( components )

  const render = ( modelNode, renderOptions = {} ) => {
    const templates = getTemplates( components )
    const nameSet = new Set()

    const onInclude = ( name, el ) => {
      nameSet.add( name )

      const content = getContent( name )

      if( content ){
        el.appendChild( content.cloneNode( true ) )
        templating.excludeFromCache( name )
      }
    }

    const defaultOptions = { onInclude, excludeStrict, useCache }

    options = Object.assign( {}, defaultOptions, options, renderOptions )

    const { document } = options
    const templating = Templating( templates, options )

    const nodeToDom = node => {
      let { name, model } = node.value
      const defaultModel = getModel( name ) || {}

      model = Object.assign( {}, defaultModel, model )

      const fragment = document.createDocumentFragment()

      if( getContent( name ) ){
        onInclude( name, fragment )

        // if single child
        if( fragment.firstChild === fragment.lastChild )
          return fragment.firstChild

        return fragment
      }

      const config = getConfig( name )

      let containerSelector = '[data-container]'

      if( config && config.containerSelector )
        containerSelector = config.containerSelector

      if( node.hasChildNodes() )
        node.childNodes.forEach( child => {
          const domChild = nodeToDom( child )

          fragment.appendChild( domChild )
        })

      const dom = getTemplate( name ) ?
        templating( name, model ) :
        document.createDocumentFragment()

      const target = select( dom, containerSelector )

      if( target ){
        target.appendChild( fragment )
      } else {
        dom.appendChild( fragment )
      }

      onInclude( name, dom )

      return dom
    }

    const node = nodeToDom( modelNode )
    const names = [ ...nameSet ]

    return { node, names }
  }

  return render
}

module.exports = Render
