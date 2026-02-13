import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SubmitHandler, FieldValues, UseFormReturn } from "react-hook-form";
import { View } from "react-native";
import { useRouter } from 'expo-router';

type SubmitProps<T extends FieldValues> = {
    form: UseFormReturn<T>
    submitText: string,
    onCancel?: CallableFunction,
    onSubmit: SubmitHandler<any>,
}

export default function SubmitButtons<T extends FieldValues>({form, submitText, onSubmit, onCancel}: SubmitProps<T>){
    const route = useRouter();
    return (
        <View className="gap-3 flex-row justify-center">
            <Button  className="" onPress={form.handleSubmit(onSubmit, (errors) => console.log(errors))}>
                <Text>{submitText}</Text>
            </Button>
            <Button
                variant="link"
                className=""
                onPress={() => onCancel ?? route.replace('..')}>
                <Text>Cancel</Text>
            </Button>
        </View>
    )
}