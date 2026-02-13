import { Input } from "@/components/my/form/Input";
import { categoryCreateType } from "@/schemes/category";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";
import { Label } from "@/components/ui/label";

type TFormProps = {
    form: UseFormReturn<categoryCreateType>,
}

export default function form({form}: TFormProps){

    return (
         <View className="gap-1.5">
            <Label htmlFor="title">Categoty title</Label>
            <Input form={form} name='title'/>
        </View>
    );
}