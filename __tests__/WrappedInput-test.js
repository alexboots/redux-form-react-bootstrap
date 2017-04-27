jest.unmock('../WrappedInput')

import { Component, PropTypes } from 'react'

import {
  FormGroup,
  HelpBlock,
  InputGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap'

import WrappedInput, {
  ROOT_CLASS
} from '../WrappedInput'

describe('WrappedInput', () => {
  const className = 'a-class-name'
  const placeholder = 'some placeholder'
  const type = 'text'
  const label = 'Some Label'
  const componentClass = undefined
  const addonAfter = undefined
  const addonBefore = undefined

  const someProp = 12
  const otherProp = true

  // Input and Meta comes from redux-form Field
  const input = {
    name: 'inputName',
    value: '',
    onChange: jest.fn()
  }

  const meta =  {
    error: 'Some Error',
    touched: false,
    pristine: undefined
  }

  const props = {
    type,
    label,
    className,
    placeholder,
    input, meta,
    someProp,
    otherProp
  }

  describe('rendered content', () => {
    let wrapper
    beforeAll(() => wrapper = getWrapper(WrappedInput, props))

    it('should render the correct class names', () => {
      expect(wrapper.hasClass(ROOT_CLASS)).toBe(true)
      expect(wrapper.hasClass(className)).toBe(true)
    })

    it('should render a `ControlLabel`', () => {
      expect(wrapper.find(ControlLabel).children().text()).toBe(label)
    })

    it('should render a `FormControl` with the correct props', () => {
      const formControl = wrapper.find(FormControl)
      expect(formControl.prop('type')).toBe(type)
      expect(formControl.prop('label')).toBe(label)
      expect(formControl.prop('componentClass')).toBe('input')
      expect(formControl.prop('placeholder')).toBe(placeholder)

      expect(formControl.prop('someProp')).toBe(undefined)
      expect(formControl.prop('otherProp')).toBe(undefined)
    })

    describe('reactionary behavior', () => {

      describe('when `componentClass` is provided', () => {
        beforeAll(() => wrapper.setProps({ componentClass: 'textarea' }))
        afterAll(() => wrapper.setProps({ componentClass }))
        it('should render a `FormControl` with the correct props', () => {
          expect(wrapper.find(FormControl).prop('componentClass')).toBe('textarea')
        })
      })

      describe('when `componentClass` is a `Component`', () => {

        const mockPropTypes = {
          className: PropTypes.string,
          someProp: PropTypes.number.isRequired,
          otherProp: PropTypes.bool.isRequired
        }

        class TestComponent extends Component { render() { return (<input />) } }

        describe('when it does not have propTypes', () => {

          beforeAll(() => wrapper.setProps({ componentClass: TestComponent }))
          afterAll(() => wrapper.setProps({ componentClass }))

          it('should render a `FormControl` with the correct props', () => {
            const formControl = wrapper.find(FormControl)
            expect(formControl.prop('type')).toBe(type)
            expect(formControl.prop('label')).toBe(label)
            expect(formControl.prop('componentClass')).toBe(TestComponent)
            expect(formControl.prop('placeholder')).toBe(placeholder)

            expect(formControl.prop('someProp')).toBe(undefined)
            expect(formControl.prop('otherProp')).toBe(undefined)
          })

        })

        describe('when it does have propTypes', () => {

          beforeAll(() => {
            TestComponent.propTypes = mockPropTypes
            wrapper.setProps({ componentClass: TestComponent })
          })

          afterAll(() => {
            wrapper.setProps({ componentClass })
            TestComponent.propTypes = undefined
          })

          it('should render a `FormControl` with the correct props', () => {
            const formControl = wrapper.find(FormControl)
            expect(formControl.prop('type')).toBe(type)
            expect(formControl.prop('label')).toBe(label)
            expect(formControl.prop('componentClass')).toBe(TestComponent)
            expect(formControl.prop('placeholder')).toBe(placeholder)

            expect(formControl.prop('someProp')).toBe(someProp)
            expect(formControl.prop('otherProp')).toBe(otherProp)
            expect(formControl.prop('className')).toBe(undefined) // className should not be included!!
          })

        })

      })

      describe('when `label` is not provided', () => {
        beforeAll(() => wrapper.setProps({ label: undefined }))
        afterAll(() => wrapper.setProps({ label }))
        it('should not render a `ControlLabel`', () => {
          expect(wrapper.find(ControlLabel).exists()).toBe(false)
        })
      })

      describe('when `addonBefore` is provided', () => {
        beforeAll(() => wrapper.setProps({ addonBefore: 'addonBefore' }))
        afterAll(() => wrapper.setProps({ addonBefore }))
        it('should render a `InputGroup.Addon`', () => {
          expect(wrapper.find(InputGroup.Addon).children().text()).toBe('addonBefore')
        })
      })

      describe('when `addonAfter` is provided', () => {
        beforeAll(() => wrapper.setProps({ addonAfter: 'addonAfter' }))
        afterAll(() => wrapper.setProps({ addonAfter }))
        it('should render a `InputGroup.Addon`', () => {
          expect(wrapper.find(InputGroup.Addon).children().text()).toBe('addonAfter')
        })
      })

      describe('when `disabled` is true', () => {
        beforeAll(() => wrapper.setProps({ disabled: true }))
        afterAll(() => wrapper.setProps({ props }))
        it('should disable the input field', () => {
          const formControl = wrapper.find(FormControl)
          expect(formControl.prop('disabled')).toBe(true)
        })
      })

      describe('when `meta.touched` and `meta.error`', () => {
        beforeAll(() => wrapper.setProps({ meta: { touched: true, error: 'Some Error' } }))
        afterAll(() => wrapper.setProps({ meta }))
        it('should display an error', () => {
          expect(wrapper.find(HelpBlock).children().text()).toBe(meta.error)
        })
      })

      describe('when `showFeedback`', () => {
        beforeAll(() => wrapper.setProps({ input: { ...input, value: 'some value' } }))
        afterAll(() => wrapper.setProps({ showFeedback }))

        it('should not render a `FormControl.Feedback`', () => {
          expect(wrapper.find(FormControl.Feedback).exists()).toBe(false)
        })

        describe('when `input.value`', () => {
          beforeAll(() => wrapper.setProps({ showFeedback: true }))
          afterAll(() => wrapper.setProps({ showFeedback }))

          describe('when `meta.touched`', () => {
            beforeAll(() => wrapper.setProps({ meta: { touched: true } }))
            afterAll(() => wrapper.setProps({ meta }))
            it('should render a `FormControl.Feedback`', () => {
              expect(wrapper.find(FormControl.Feedback).exists()).toBe(true)
            })
          })

          describe('when `meta.pristine`', () => {
            beforeAll(() => wrapper.setProps({ meta: { pristine: true } }))
            afterAll(() => wrapper.setProps({ meta }))
            it('should render a `FormControl.Feedback`', () => {
              expect(wrapper.find(FormControl.Feedback).exists()).toBe(true)
            })
          })
        })

      })

    })

  })

})
