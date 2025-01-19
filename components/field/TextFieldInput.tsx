import AutoSizeInput, { AutoSizeInputProps } from '@/components/input/AutoSizeInput'

const TextFieldInput = ({ label, value, ...props }: AutoSizeInputProps & { label: string }) => {
  return (
    <AutoSizeInput placeholder={`No ${label}`} value={value} {...props} />
  )
}

export default TextFieldInput
