import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Form from './form';
import Mock from '@/models_mock/Mock';
import { productCreateSchema, productCreateType, productType } from '@/schemes/product';
import Products from "@/models_mock/Products";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from '@tanstack/react-query';
import QueryEvent from "@/components/my/QueryEvents";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorDialog } from '@/providers/ErrorDialogProvider';
import SubmitButtons from '@/components/my/form/SubmitButtons';
 
export default function edit() {
    const products = Mock.create(Products);
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const queryClient = useQueryClient();
    const { setErrorMessage } = useErrorDialog();

    const productQuery = useQuery<productCreateType>({
        queryKey: ['product_' + id],
        queryFn: () => {
            return products.readOne(id);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const mutation = useMutation({
        mutationFn: async (updateProduct: productType) => {
            queryClient.setQueryData(['products'], (old: productType[]) => 
                old.map(product => product.id == updateProduct.id ? updateProduct : product)
            );
            await products.update(updateProduct);
        },
        onError: (error, variables, onMutateResult, context) => {
            queryClient.setQueryData(['products'], (old: productType[]) => 
                old?.filter((product: productType) => product.id !== variables.id)
            );
            setErrorMessage('Error update product: ' + variables.title);
        }
    });

    const form = useForm({
        resolver: zodResolver(productCreateSchema),
        values: productQuery.data
    });

    if (productQuery.isLoading || productQuery.isError){
        return <QueryEvent query={productQuery} />
    }


    function onSubmit(product: productCreateType) {
        mutation.mutate({id: id, ...product});
        router.replace('/product')
    }
    
    return (
    <View className="gap-6">
        <Card className="border-border/0 sm:border-border pb-4 shadow-none sm:shadow-sm sm:shadow-black/5">
            <CardHeader>
                <CardTitle className="text-center text-xl sm:text-left">Add Product</CardTitle>
            </CardHeader>
            <CardContent className="gap-6">
                <Form form={form} />
                <SubmitButtons onSubmit={onSubmit} submitText='Update' form={form} />          
            </CardContent>
        </Card>
    </View>
    );
}