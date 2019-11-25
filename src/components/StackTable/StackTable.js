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
          <tr>
            <td>{index + 1}</td>
            <td>{ele.maxStack}</td>
            <td>{ele.timeUsed} ms</td>
          </tr>
        ))}

      <tr>
        <td>
          <b>avg</b>
        </td>
        <td>
          <b>2</b>
        </td>
        <td>
          <b>2 ms</b>
        </td>
      </tr>
    </tbody>
  </Table>
)
