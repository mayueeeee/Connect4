import React from 'react'
import isNull from 'lodash/isNull'
import { Table } from 'react-bootstrap'

export default props => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>#</th>
        <th>Max Stack</th>
        <th>Time Used</th>
      </tr>
    </thead>
    <tbody>
      {!isNull(props.trace) &&
        props.trace.map((ele, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{ele.maxStack}</td>
            <td>{ele.timeUsed} ms</td>
          </tr>
        ))}
      {!isNull(props.trace) && props.winner && (
        <>
          <tr>
            <td>
              <b>avg</b>
            </td>
            <td>
              <b>
                {(
                  props.trace.reduce(
                    (total, next) => total + next.maxStack,
                    0
                  ) / props.trace.length
                ).toFixed(2)}
              </b>
            </td>
            <td>
              <b>
                {(
                  props.trace.reduce(
                    (total, next) => total + next.timeUsed,
                    0
                  ) / props.trace.length
                ).toFixed(2)}{' '}
                ms
              </b>
            </td>
          </tr>

          <tr>
            <td>
              <b>max</b>
            </td>
            <td>
              <b>
                {Math.max.apply(Math, props.trace.map(ele => ele.maxStack))}
              </b>
            </td>
            <td>
              <b>
                {Math.max.apply(Math, props.trace.map(ele => ele.timeUsed))} ms
              </b>
            </td>
          </tr>

          <tr>
            <td>
              <b>min</b>
            </td>
            <td>
              <b>
                {Math.min.apply(Math, props.trace.map(ele => ele.maxStack))}
              </b>
            </td>
            <td>
              <b>
                {Math.min.apply(Math, props.trace.map(ele => ele.timeUsed))} ms
              </b>
            </td>
          </tr>
        </>
      )}
    </tbody>
  </Table>
)
