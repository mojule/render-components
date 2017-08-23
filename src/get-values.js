'use strict'

const utils = require( '@mojule/utils' )
const componentValueNames = require( './names' )

const { capitalizeFirstLetter } = utils

const getValues = components =>
  componentValueNames.reduce( ( api, dataName ) => {
    const fname = 'get' + capitalizeFirstLetter( dataName )

    api[ fname ] = name => {
      if( components[ name ] )
        return components[ name ][ dataName ]
    }

    return api
  }, {})

module.exports = getValues
