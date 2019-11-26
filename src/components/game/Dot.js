import styled from 'styled-components'
import React from 'react'
import PropTypes from 'prop-types'

const getColorCode = symbol => {
  switch (symbol) {
    case 1:
      return '#18bc9c'
    case 2:
      return '#f30154'
    default:
      return '#233140'
  }
}

const Dot = props => (
  <div
    style={{
      width: '4vw',
      height: '4vw',
      borderRadius: '50%',
      backgroundColor: getColorCode(props.symbol),
    }}
  ></div>
)

Dot.propTypes = {
  symbol: PropTypes.oneOf([0, 1, 2]),
}
export default Dot
