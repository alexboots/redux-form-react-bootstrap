jest.unmock('../WrappedRadio')

import React from 'react'

import {
  mount,
  shallow
} from 'enzyme'

import {
  Radio
} from 'react-bootstrap'

import WrappedRadio, {
  ROOT_CLASS
} from '../WrappedRadio'

describe('WrappedRadio', () => {
  let wrapper
  let props

  let className = 'a-class-name'
  let label = 'Some Label'
  let value = 'some_value'

  // Input and Meta comes from redux-form Field
  let input = {
    value,
    onChange: jest.fn(),
    name: 'inputName',
    checked: false
  }

  let meta =  {
    touched: true,
    error: 'Some Error'
  }

  describe('rendered content', () => {
    beforeAll(() => {
      props = {
        className,
        input,
        label,
        meta
      }

      wrapper = shallow(<WrappedRadio { ...props } />)
    })

    afterAll(() => {
      props = undefined
      wrapper = undefined
    })

    it('should render `className` to the wrapper', () => {
      expect(wrapper.hasClass(className)).toBeTruthy()
    })

    describe('Radio', () => {
      it('should receive props name, label, placeholder, type', () => {
        let inputNode = wrapper.find(Radio)
        expect(inputNode.prop('name')).toEqual(input.name)
        expect(inputNode.prop('value')).toEqual(input.value)
        expect(inputNode.prop('checked')).toEqual(input.checked)
      })

      it('should show a label if one is passed', () => {
        let labelNode = wrapper.find(Radio).find('span')
        expect(labelNode.contains(label)).toBe(true)
      })

      it('should not show a label if one is not passed', () => {
        wrapper.setProps({ label: undefined })
        let labelNode = wrapper.find(Radio).find('span')
        expect(labelNode.contains(label)).toBe(false)
      })

      it('should call input.onChange with input.value when clicked', () => {
        let radioNode = wrapper.find(Radio)
        expect(input.onChange).not.toBeCalled()
        radioNode.simulate('change', { target: { value } })
        expect(input.onChange).toBeCalled()
        expect(input.onChange.mock.calls[0][0]).toEqual(input.value)
      })
    })
  })
})