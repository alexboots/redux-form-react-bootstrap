// react-select setup for use with redux-form
// pass into redux-forms field
//   <Field component={ WrappedSelect } />

/*
  Required props:
    options:     ArrayOf(objects): formatted: [{value: 'some_value', label: 'Field Name'}]
    name:        String: Name of form field
    placeholder: String
    label: String:  (Optional) Input label
*/

import classNames from 'classnames'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  FormGroup,
  HelpBlock,
  ControlLabel
} from 'react-bootstrap'

import Select from 'react-select'

export const ROOT_CLASS = 'wrapped-select'

export default class WrappedSelect extends Component {

  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }

  onChange(selection) {
    const value = selection && (
      this.props.multi ?
        selection.map(({ value }) => value) : selection.value
    )
    this.props.input.onChange(value)
    if (this.props.onChange) this.props.onChange(value)
  }

  render() {
    const {
      className,
      label, options,
      input, placeholder,
      clearable, disabled, multi,
      meta: { touched, error }
    } = this.props

    return(
      <FormGroup className={ classNames( ROOT_CLASS, className ) }
        validationState={ (touched && error) ? 'error' : null }
      >
        { (touched && error) ? (
          <HelpBlock className="pull-right">
            { error }
          </HelpBlock>
        ) : null }

        { (input.name && label) ? (
          <ControlLabel htmlFor={ input.name }>
            { label }
          </ControlLabel>
        ) : null }

        <Select
          className={ (touched && error) ? 'error-outline' : null }
          clearable={ clearable }
          disabled={ disabled }
          multi={ multi }
          name={ input.name }
          options={ options }
          placeholder={ placeholder }
          value={ input.value }
          onChange={ this.onChange }
        />

      </FormGroup>
    )
  }
}

WrappedSelect.propTypes = {
  className: PropTypes.string,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }).isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool
  }),
  multi: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func
}
