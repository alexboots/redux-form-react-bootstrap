jest.unmock('../WrappedSelect')

import {
  FormGroup,
  HelpBlock,
  ControlLabel
} from 'react-bootstrap'

import Select from 'react-select'

import WrappedSelect, {
  ROOT_CLASS
} from '../WrappedSelect'

describe('WrappedSelect', () => {

  const multi = false
  const disabled = false
  const clearable = false
  const className = 'a-class-name'
  const label = 'Some Label'
  const options = [{ value: 'some_value', label: 'Field Name' }]
  const placeholder = 'some placeholder'
  const onChange = jest.fn()

  // Input and Meta comes from redux-form Field
  const input = {
    name: 'inputName',
    value: '',
    onChange: jest.fn()
  }

  const meta =  {
    touched: false,
    error: 'Some Error'
  }

  const props = {
    label,
    options,
    className,
    placeholder,
    input, meta,
    onChange,
    multi, disabled, clearable
  }

  describe('rendered content', () => {
    let wrapper
    beforeAll(() => wrapper = getWrapper(WrappedSelect, props))

    it('should render the correct class names', () => {
      expect(wrapper.hasClass(ROOT_CLASS)).toBe(true)
      expect(wrapper.hasClass(className)).toBe(true)
    })

    it('should render a `ControlLabel`', () => {
      const inputNode = wrapper.find(ControlLabel)
      expect(inputNode.props().htmlFor).toBe(input.name)
      expect(inputNode.children().text()).toBe(label)
    })

    it('should render a `Select`', () => {
      const select = wrapper.find(Select)
      expect(select.hasClass('error-outline')).toBe(false)
      expect(select.props().clearable).toBe(clearable)
      expect(select.props().disabled).toBe(disabled)
      expect(select.props().name).toBe(input.name)
      expect(select.props().value).toBe(input.value)
      expect(select.props().options).toBe(options)
      expect(select.props().placeholder).toBe(placeholder)
      expect(select.props().onChange).toEqual(jasmine.any(Function))
    })

    describe('reactionary behavior', () => {

      describe('when there is no `label`', () => {
        beforeAll(() => wrapper.setProps({ label: undefined }))
        afterAll(() => wrapper.setProps({ label }))
        it('should not render a `ControlLabel`', () => {
          expect(wrapper.find(ControlLabel).exists()).toBe(false)
        })
      })

      describe('when field has been touched and an error exists', () => {
        beforeAll(() => wrapper.setProps({ meta: { ...meta, touched: true } }))
        afterAll(() => wrapper.setProps({ meta }))
        it('should show an error outline', () => {
          expect(wrapper.find(Select).hasClass('error-outline')).toBe(true)
        })
      })

      describe('when `touched` and `error`', () => {
        beforeAll(() => wrapper.setProps({ meta: { touched: true, error: 'Error' } }))
        afterAll(() => wrapper.setProps({ meta }))
        it('should show an error message', () => {
          const helpBlock = wrapper.find(HelpBlock)
          expect(helpBlock.children().text()).toBe('Error')
        })

        it('should update `Select`', () => {
          expect(wrapper.find(Select).hasClass('error-outline')).toBe(true)
        })
      })

      describe('on change `Select`', () => {
        beforeEach(() => {
          onChange.mockClear()
          input.onChange.mockClear()
        })

        it('should call `input.onChange`, `onChange` with the new value', () => {
          expect(onChange).not.toBeCalled()
          expect(input.onChange).not.toBeCalled()

          wrapper.find(Select).props().onChange({ value: 'some-value' })

          expect(onChange).toBeCalledWith('some-value')
          expect(input.onChange).toBeCalledWith('some-value')
        })

        describe('when `multi`', () => {
          beforeAll(() => wrapper.setProps({ multi: true }))
          afterAll(() => wrapper.setProps({ multi }))

          it('should call `input.onChange`, `onChange` with the new value', () => {
            expect(onChange).not.toBeCalled()
            expect(input.onChange).not.toBeCalled()

            wrapper.find(Select).props().onChange([{ value: 'some-value' }])

            expect(onChange).toBeCalledWith(['some-value'])
            expect(input.onChange).toBeCalledWith(['some-value'])
          })
        })
      })
    })
  })
})
