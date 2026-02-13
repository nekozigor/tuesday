import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Categories from "@/models_mock/Categories";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryCreateSchema, categoryCreateType, categoryType } from '@/schemes/category';
import { useErrorDialog } from '@/providers/ErrorDialogProvider';
import { generateUUID } from '@/lib/uuid';
import Mock from '@/models_mock/Mock';
import SubmitButtons from "@/components/my/form/SubmitButtons";
import Form from '../category/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function add() {
    const categories = Mock.create(Categories);
    const { setErrorMessage } = useErrorDialog();
    const queryClient = useQueryClient();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(categoryCreateSchema),
        defaultValues: {}
    });
    const mutation = useMutation({
        mutationFn: async (newCategory: categoryType) => {
            queryClient.setQueryData(['categories'], (old: categoryType[]) => 
                [...(old || []), newCategory]
            );
            await categories.add(newCategory);
        },
        onError: (error, variables, onMutateResult, context) => {
            queryClient.setQueryData(['categories'], (old: categoryType[]) => 
                old?.filter((category: categoryType) => category.id !== variables.id)
            );
            setErrorMessage('Error adding category: ' + variables.title);
        }
    });

    function onSubmit(category: categoryCreateType) {
        mutation.mutate({id: generateUUID(), ...category});
        router.replace('/category')
    }
    
    return (
    <View className="gap-6">
        <Card className="border-border/0 sm:border-border pb-4 shadow-none sm:shadow-sm sm:shadow-black/5">
            <CardHeader>
                <CardTitle className="text-center text-xl sm:text-left">Add Category</CardTitle>
            </CardHeader>
            <CardContent className="gap-6">
                <View className="gap-6">
                    <Form form={form} />
                    <SubmitButtons form={form} submitText='Add' onSubmit={onSubmit} />
                </View>
            </CardContent>
        </Card>
    </View>
    );
}