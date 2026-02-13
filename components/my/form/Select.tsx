import {
    Select as UISelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import React from 'react';
import { Controller, FieldValues, UseFormReturn, Path } from "react-hook-form";
import { View } from 'react-native';
import { Error } from './Error';

interface SelectProps<T extends FieldValues, itemType> {
    form: UseFormReturn<T>,
    name: Path<T>,
    items: itemType[],
    fieldName: keyof itemType
}

export default function Select<T extends FieldValues, itemType extends {id: string}>({form, name, items, fieldName}: SelectProps<T, itemType>){

    return (
        <View>
            <Controller
                control={form.control}
                name={name}
                render={({ field: { onChange, value }, fieldState: {error} }) => {
                    return (<>
                        <UISelect value={{label: '', value: value ? items.find(i => i.id === value.id)?.id || '' : ''}} 
                            onValueChange={(e) => onChange(items.find(i => i.id === e?.value))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                            <SelectContent className="w-[180px]">
                                {items.map((item) => (      
                                    <SelectItem key={item.id} label={item[fieldName] as string} value={item.id}>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </UISelect>
                        <Error errors={[error]} />
                    </>)}}
                />
        </View>
    )
}