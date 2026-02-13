import { Label } from "@/components/ui/label";
import { Input } from '@/components/my/form/Input'
import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { categoryType } from "@/schemes/category";
import Mock from "@/models_mock/Mock";
import Categories from "@/models_mock/Categories";
import QueryEvent from "@/components/my/QueryEvents";
import { UseFormReturn } from "react-hook-form";
import { productCreateType } from "@/schemes/product";
import Select from "@/components/my/form/Select";

type TFormProps = {
    form: UseFormReturn<productCreateType>,
}

export default function Form({ form }: TFormProps){

    const categories = Mock.create(Categories);

    const categoriesQuery = useQuery<categoryType[]>({
        queryKey: ['categories'],
        queryFn: () => {
            return categories.read();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    if (categoriesQuery.isLoading || categoriesQuery.isError || !categoriesQuery.data){
        return <QueryEvent query={categoriesQuery} />
    }

    return (<>
        <View className="gap-6">
            <View className="gap-1.5">
                <Label htmlFor="title">Product title</Label>
                <Input form={form} name='title'/>
            </View>
            <View className=''>
                <Label htmlFor='category'>Category</Label>
                <Select<productCreateType, categoryType> fieldName='title' form={form} items={categoriesQuery.data} name="category"/>
            </View>
        </View>
    </>)
}