import styled from 'styled-components'
import PropTypes from 'prop-types'

const getColorCode = color => {
    console.log(color)
    switch (color) {
        case 'green':
            return '#18bc9c'
        case 'red':
            return '#f30154'
        default:
            return '#233140'
    }
}

const Dot = styled.div`
    width: 4vw;
    height: 4vw;
    border-radius: 50%;
    background-color: ${props => getColorCode(props.color)};
`

Dot.propTypes = {
    color: PropTypes.oneOf(['green', 'red', 'blank']),
}
export default Dot
