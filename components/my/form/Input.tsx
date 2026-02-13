
import {  FieldValues, Controller, UseFormReturn, Path } from "react-hook-form"
import { TextInput, View } from "react-native"
import { Error } from "./Error"
import { Input as UIInput } from "@/components/ui/input"

interface Props<T extends FieldValues> extends React.ComponentProps<typeof TextInput> {
    form: UseFormReturn<T>,
    name: Path<T>,
    placeholder?: string,
}

export function Input<T extends FieldValues>({form, name, placeholder, ...props}: Props<T>){
    return (
        <View >
            <Controller
                control={form.control}
                name={name}
                render={({ field: { onChange, onBlur, value }, fieldState: {error} }) => {
                return (<>
                    <UIInput
                        {...props}
                        placeholder={placeholder ? placeholder : ''}
                        // style={styles.input}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ? value : ''}
                        returnKeyType="done"
                    />
                    <Error errors={[error]} />
                </>)}}
            />
        </View>
    )
}