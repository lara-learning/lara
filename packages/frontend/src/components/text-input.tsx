import React, { JSX } from 'react'

import { StyledTextInput, StyledTextInputLabel } from '@lara/components'

interface TextInputProps extends React.InputHTMLAttributes<unknown> {
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  validate?: (input: string) => boolean
  inputRef?: (ref: HTMLInputElement) => void
  label?: string
  type?: string
  defaultValue?: string
  floating?: boolean
  placeholder?: string
  disabled?: boolean
}

interface TextInputState {
  valid: boolean
}

class TextInput extends React.Component<TextInputProps, TextInputState> {
  public state = {
    valid: true,
  }

  public ref?: HTMLInputElement

  public onChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const { onChange } = this.props

    if (onChange) {
      onChange(event)
    }

    this.validate()
  }

  public isValid = (): boolean => {
    const { validate } = this.props

    if (!this.ref || !validate) {
      return true
    }

    return validate(this.ref.value)
  }

  public validate = (): void => {
    this.setState({
      valid: this.isValid(),
    })
  }

  public onBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    const { onBlur } = this.props

    if (onBlur) {
      onBlur(event)
    }

    this.validate()
  }

  public setRef = (ref: HTMLInputElement | null): void => {
    if (!ref) {
      return
    }

    const { inputRef } = this.props

    if (inputRef) {
      inputRef(ref)
    }

    this.ref = ref
  }

  public render = (): JSX.Element => {
    const { label, defaultValue, floating, type, placeholder, onKeyDown, disabled } = this.props
    const { valid } = this.state

    return (
      <div>
        <StyledTextInputLabel valid={valid}>
          {label}
          <StyledTextInput
            ref={this.setRef}
            disabled={disabled}
            type={type}
            placeholder={placeholder}
            floating={Boolean(floating)}
            onBlur={(event: React.FocusEvent<HTMLInputElement>) => this.onBlur(event)}
            valid={valid}
            onChange={this.onChange}
            onKeyDown={onKeyDown}
            defaultValue={defaultValue}
          />
        </StyledTextInputLabel>
      </div>
    )
  }
}

export default TextInput
