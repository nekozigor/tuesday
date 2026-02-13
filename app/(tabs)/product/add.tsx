import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Products from "@/models_mock/Products";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productCreateSchema, productCreateType, productType } from '@/schemes/product';
import { useErrorDialog } from '@/providers/ErrorDialogProvider';
import { generateUUID } from '@/lib/uuid';
import Mock from '@/models_mock/Mock';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from './form';
import SubmitButtons from '@/components/my/form/SubmitButtons';

export default function add() {
    const products = Mock.create(Products);
    const { setErrorMessage } = useErrorDialog();
    const queryClient = useQueryClient();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(productCreateSchema),
        defaultValues: {}
    });
    
    const mutation = useMutation({
        mutationFn: async (newProduct: productType) => {
            queryClient.setQueryData(['products'], (old: productType[]) => 
                [...(old || []), newProduct]
            );
            await products.add(newProduct);
        },
        onError: (error, variables, onMutateResult, context) => {
            queryClient.setQueryData(['products'], (old: productType[]) => 
                old?.filter((product: productType) => product.id !== variables.id)
            );
            setErrorMessage('Error adding product: ' + variables.title);
        }
    });

    function onSubmit(product: productCreateType) {
        mutation.mutate({id: generateUUID(), title: product.title, category: product.category});
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
                <SubmitButtons  onSubmit={onSubmit} submitText='Add' form={form} />         
            </CardContent>
        </Card>
    </View>
    );
}