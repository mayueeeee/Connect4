import React, { useEffect } from 'react'
import Dot from '../Dot'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'

const Row = props => {
    useEffect(() => {
        console.log('yay')
    })

    return (
        <div className="game-row">
            <div className="column">
                {!isEmpty(props.data) &&
                    props.data.map((color, i) => (
                        <div
                            className="columns"
                            onClick={e => props.onClick(i, 'yay')}
                        >
                            <div className="column is-12">
                                <Dot key={i} color={color} />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
Row.defaultProps = {
    data: [],
}

Dot.propTypes = {
    data: PropTypes.array,
}

export default Row
