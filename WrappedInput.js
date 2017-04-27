// react-bootstrap form input with redux-forms
// pass into redux-forms field
//   <Field component={ WrappedInput } />

/*
  Required props:
    name:           String: Name of form field
    placeholder:    String
    type: String:   Type of form field
    label: String:  (Optional) Input label
    componentClass: (Optional) pass 'textarea' if you wish to have a textarea
*/

import classNames from 'classnames'
import { isEmpty, isFunction, pick, without } from 'lodash'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  FormGroup,
  InputGroup,
  FormControl,
  ControlLabel,
  HelpBlock
} from 'react-bootstrap'

export const ROOT_CLASS = 'redux-form-wrapped-input'
export const ERROR_CHILD_CLASS = `${ROOT_CLASS}-error`
export const HELP_TEXT_CHILD_CLASS = `${ROOT_CLASS}-help-text`

export default class WrappedInput extends Component {

  render() {
    const {
      className,
      disabled,
      helpText,
      componentClass,
      addonAfter, addonBefore,
      showFeedback, showSuccess,
      input, label, type, placeholder,
      meta: { error, pristine, touched }
    } = this.props

    const shouldShowFeedback = (
      !error && // there are no errors
      showFeedback && // the flag is true
      (touched || pristine) && // field is touched or form is pristine
      !isEmpty(input.value) // the value is not empty
    )

    const validationState = !error ? (
      (showSuccess && !isEmpty(input.value)) ? 'success' : null // highlight valid non-empty values
    ) : (touched ? 'error' : null) // highlight touched invalid values

    let inputProps = {}
    if (isFunction(componentClass) && componentClass.propTypes)
      inputProps = pick(this.props, without(Object.keys(componentClass.propTypes), 'className'))

    return(
      <FormGroup className={ classNames(ROOT_CLASS, className) }
        validationState={ validationState }
      >
        { (touched && error) ? (
          <HelpBlock className="pull-right">
            { error }
          </HelpBlock>
        ) : null }

        { input.name && label ? (
          <ControlLabel htmlFor={ input.name }>
            { label }
          </ControlLabel>
        ) : null }

        { helpText ? (
          <HelpBlock className={ HELP_TEXT_CHILD_CLASS } componentClass="p">
            { helpText }
          </HelpBlock>
        ) : null }

        <InputGroup>

          { addonBefore ? (
            <InputGroup.Addon>
              { addonBefore }
            </InputGroup.Addon>
          ) : null }

          <FormControl
            componentClass={ componentClass }
            label={ label }
            placeholder={ placeholder }
            type={ type }
            disabled={ disabled }
            { ...inputProps }
            { ...input }
          />

          { addonAfter ? (
            <InputGroup.Addon>
              { addonAfter }
            </InputGroup.Addon>
          ) : null }

          { shouldShowFeedback ? (
            <FormControl.Feedback>
              TODO: Add feedback icon
            </FormControl.Feedback>
          ) : null }

        </InputGroup>

      </FormGroup>
    )
  }
}

WrappedInput.defaultProps = {
  componentClass: 'input',
  showSuccess: true
}

WrappedInput.propTypes = {
  addonAfter: PropTypes.node,
  addonBefore: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  componentClass: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),
  helpText: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any
  }).isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.string,
    pristine: PropTypes.bool,
    touched: PropTypes.bool
  }),
  placeholder: PropTypes.string,
  showFeedback: PropTypes.bool,
  showSuccess: PropTypes.bool,
  type: PropTypes.string
}
