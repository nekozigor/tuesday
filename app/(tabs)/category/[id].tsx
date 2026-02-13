import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryCreateSchema, categoryCreateType, categoryType } from '@/schemes/category';
import Form from '../category/form';
import SubmitButtons from '@/components/my/form/SubmitButtons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import QueryEvent from '@/components/my/QueryEvents';
import Mock from '@/models_mock/Mock';
import { useErrorDialog } from '@/providers/ErrorDialogProvider';
import Categories from '@/models_mock/Categories';
 
export default function edit() {
    const categories = Mock.create(Categories);
    const router = useRouter()
    const { id } = useLocalSearchParams<{ id: string }>();
    const queryClient = useQueryClient();
    const { setErrorMessage } = useErrorDialog();
    const categoryQuery = useQuery<categoryCreateType>({
        queryKey: ['category_' + id],
        queryFn: () => {
            return categories.readOne(id);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const mutation = useMutation({
        mutationFn: async (updateCategory: categoryType) => {
            queryClient.setQueryData(['categories'], (old: categoryType[]) => 
                old.map(category => category.id == updateCategory.id ? updateCategory : category)
            );
            await categories.update(updateCategory);
        },
        onError: (error, variables, onMutateResult, context) => {
            queryClient.setQueryData(['categories'], (old: categoryType[]) => 
                old?.filter((category: categoryType) => category.id !== variables.id)
            );
            setErrorMessage('Error update category: ' + variables.title);
        }
    });
    const form = useForm({
        resolver: zodResolver(categoryCreateSchema),
        values: categoryQuery.data
    });
    
    if (categoryQuery.isLoading || categoryQuery.isError){
        return <QueryEvent query={categoryQuery} />
    }

    function onSubmit(category: categoryCreateType) {
        mutation.mutate({ id: id, ...category });
        router.replace('..');
    }
    
    return (
        <View className="gap-6">
        <Card className="border-border/0 sm:border-border pb-4 shadow-none sm:shadow-sm sm:shadow-black/5">
            <CardHeader>
                <CardTitle className="text-center text-xl sm:text-left">Add Menu</CardTitle>
            </CardHeader>
            <CardContent className="gap-6">
                <View className="gap-6">
                    <Form form={form} />
                    <SubmitButtons form={form} submitText='Update' onSubmit={onSubmit} />
                </View>
            </CardContent>
        </Card>
        </View>
    );
}