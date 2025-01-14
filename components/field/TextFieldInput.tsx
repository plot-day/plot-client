import AutoSizeInput, { AutoSizeInputProps } from '@/components/input/AutoSizeInput'

const TextFieldInput = ({ label, ...props }: AutoSizeInputProps & { label: string }) => {
  return (
    <AutoSizeInput placeholder={`No ${label}`} {...props} />
  )
}

export default TextFieldInput
