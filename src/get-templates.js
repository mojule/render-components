'use strict'

const getValues = require( './get-values' )

const getTemplates = components => {
  const { getTemplate } = getValues( components )
  const names = Object.keys( components )

  return names.reduce( ( templates, name ) => {
    const template = getTemplate( name )

    if( template )
      templates[ name ] = template

    return templates
  }, {} )
}

module.exports = getTemplates
