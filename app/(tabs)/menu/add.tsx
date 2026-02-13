import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import Menus from "@/models_mock/Menus";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuCreateSchema, menuCreateType, menuType } from '@/schemes/menu';
import { useErrorDialog } from '@/providers/ErrorDialogProvider';
import { generateUUID } from '@/lib/uuid';
import Mock from '@/models_mock/Mock';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from './form/form';
import SubmitButtons from '@/components/my/form/SubmitButtons';

export default function add() {
    const menus = Mock.create(Menus);
    const { setErrorMessage } = useErrorDialog();
    const queryClient = useQueryClient();
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(menuCreateSchema),
    });
    const mutation = useMutation({
        mutationFn: async (newMenu: menuType) => {
            queryClient.setQueryData(['menus'], (old: menuType[]) => 
                [...(old || []), newMenu]
            );
            await menus.add(newMenu);
        },
        onError: (error, variables, onMutateResult, context) => {
            queryClient.setQueryData(['menus'], (old: menuType[]) => 
                old?.filter((menu: menuType) => menu.id !== variables.id)
            );
            setErrorMessage('Error adding menu: ' + variables.title);
        }
    });

    function onSubmit(menu: menuCreateType) {
        mutation.mutate({id: generateUUID(), ...menu, status: 'inactive'});
        router.replace('/menu')
    }
    
    return (
    <View className="gap-6">
        <Card className="border-border/0 sm:border-border pb-4 shadow-none sm:shadow-sm sm:shadow-black/5">
            <CardHeader>
                <CardTitle className="text-center text-xl sm:text-left">
                    Add Menu
                </CardTitle> 
            </CardHeader>
            <Form form={form} />
            <SubmitButtons onSubmit={onSubmit} submitText='Add' form={form} onCancel={() => router.replace('./menu')}/>
        </Card>
    </View>
    );
}