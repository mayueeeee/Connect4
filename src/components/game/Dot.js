import styled from 'styled-components'
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

const Dot = styled.div`
  width: 4vw;
  height: 4vw;
  border-radius: 50%;
  background-color: ${props => getColorCode(props.symbol)};
`

Dot.propTypes = {
  symbol: PropTypes.oneOf([0, 1, 2]),
}
export default Dot
