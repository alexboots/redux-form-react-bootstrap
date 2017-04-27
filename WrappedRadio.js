// react-bootstrap Radio input with redux-forms
// pass into redux-forms field

/*
  <Field
    label={ label }
    name="someName"
    component={ WrappedRadio }
    type="radio"
    value={ childCategory }
  />

  Required props:
    name:  String: Name for radio's
    label: String: Input label
    value: String: form value for radio
*/

import React, {
  Component,
  PropTypes
} from 'react'

import {
  Radio
} from 'react-bootstrap'

import classNames from 'classnames'

export const ROOT_CLASS = 'wrapped-button-group'

export default class WrappedRadio extends Component {

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    this.props.input.onChange(e.target.value)
    if (this.props.onChange) this.props.onChange(e.target.value)
  }

  render() {
    const { className, input, label, disabled } = this.props
    const { name, value, checked } = input

    return(
      <Radio
        checked={ checked }
        className={ classNames( ROOT_CLASS, className ) }
        disabled={ disabled }
        name={ name }
        value={ value }
        onChange={ this.onChange }
      >
        <span>{ label }</span>
      </Radio>
    )
  }
}

WrappedRadio.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  }).isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func
}
