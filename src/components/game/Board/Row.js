import React from 'react'
import Dot from '../Dot'
import isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'

const Row = props => {
    return (
        <div className="game-row">
            <div className="column">
                {!isEmpty(props.data) &&
                props.data.map((symbol, i) => (
                    <div
                        key={`row_${i}`}
                        className="columns"
                        onClick={props.onClick}
                    >
                        <div className="column is-12">
                            <Dot key={i} symbol={symbol}/>
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
