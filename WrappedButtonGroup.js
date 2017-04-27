// react-bootstrap custom input with redux-forms
// pass into redux-forms field
//   <Field component={ WrappedButtonGroup } />

/*
  Required props:
    options:  Array of objects with label/value:
                        [{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }]
    name:             String: Name of form field
    selectFirst: boolean: (optional) First value in ButtonGroupData will be selected
*/
import classNames from 'classnames'
import { pick } from 'lodash'

import React, {
  Component,
  PropTypes
} from 'react'

import {
  ButtonGroup,
  Button,
  HelpBlock,
  ControlLabel,
  FormGroup
} from 'react-bootstrap'

export const ROOT_CLASS = 'wrapped-button-group'
export const ACTIVE = 'active'

export default class WrappedButtonGroup extends Component {
  onHandleClick = value => () => this.props.input.onChange(value)

  componentDidMount() {
    // Auto select first button unless there is already a value defined
    const { options, selectFirst, input } = this.props
    if (!input.value && selectFirst) input.onChange(options[0].value)
  }

  render() {
    const {
      className,
      input, label, options,
      meta: { touched, error }
    } = this.props

    const calculateButtonWidth = {
      width: `${100/options.length}%`
    }

    return (
      <FormGroup className={ classNames( className, ROOT_CLASS, {
        'error-outline': (touched && error)
      }) }>

        { (touched && error) ? (
          <HelpBlock className="pull-right">
            { error }
          </HelpBlock>
        ) : null }

        { label ? (
          <ControlLabel>
            { label }
          </ControlLabel>
        ) : null }

        <ButtonGroup justified
          { ...pick(this.props, Object.keys(ButtonGroup.propTypes)) }
          name={ input.name }
        >
          { options.map(({ value, label, disabled }, index) => (
            <Button className={ classNames({ [ACTIVE]: input.value === value }) }
              disabled={ disabled }
              key={ index }
              style={ calculateButtonWidth }
              onClick={ this.onHandleClick(value) }
            >
              { label }
            </Button>
          )) }
        </ButtonGroup>

      </FormGroup>
    )
  }
}

WrappedButtonGroup.propTypes = {
  ...ButtonGroup.propTypes,
  className: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  }).isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool
  }),
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  selectFirst: PropTypes.bool
}
