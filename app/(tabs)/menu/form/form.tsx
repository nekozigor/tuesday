import { UseFormReturn } from "react-hook-form";
import { menuCreateType } from "@/schemes/menu";
import { View } from "react-native";
import { Label } from "@/components/ui/label";
import { CardContent} from "@/components/ui/card";
import { Input } from "@/components/my/form/Input";

type TFormProps = {
    form: UseFormReturn<menuCreateType>,
}

export default function form({form}: TFormProps){
    return (
        <CardContent className="gap-6">
            <View className="gap-6"></View>
            <View className="gap-1.5">
                <Label htmlFor="title">Menu title</Label>
                <Input form={form} name='title'/>
            </View>
        </CardContent>
    );
}