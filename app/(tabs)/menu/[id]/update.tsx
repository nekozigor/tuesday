import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useRouter } from 'expo-router';
import { View } from 'react-native';
import Menus from "@/models_mock/Menus";
import { useLocalSearchParams } from 'expo-router';
import Mock from '@/models_mock/Mock';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { menuCreateSchema, menuCreateType, menuType } from '@/schemes/menu';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Form from '../form/form';
import SubmitButtons from '@/components/my/form/SubmitButtons';
import { useErrorDialog } from '@/providers/ErrorDialogProvider';
import QueryEvent from '@/components/my/QueryEvents';
 
export default function edit() {

    const router = useRouter()
    const { id } = useLocalSearchParams<{ id: string }>();
    const menus = Mock.create(Menus);
    const queryClient = useQueryClient();
    const { setErrorMessage } = useErrorDialog();
    const menuQuery = useQuery<menuType>({
        queryKey: ['menu_' + id],
        queryFn: async () => {
            return await menus.readOne(id);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const mutation = useMutation({
        mutationFn: async (updateMenu: menuType) => {
            queryClient.setQueryData(['menus'], (old: menuType[]) => 
                old.map(menu => menu.id == updateMenu.id ? updateMenu : menu)
            );
            await menus.update(updateMenu);
        },
        onError: (error, variables, onMutateResult, context) => {
            queryClient.setQueryData(['menus'], (old: menuType[]) => 
                old?.filter((product: menuType) => product.id !== variables.id)
            );
            setErrorMessage('Error update menu: ' + variables.title);
        }
    });
    
    const form = useForm({
        resolver: zodResolver(menuCreateSchema),
        values: menuQuery.data
    });
    
    if (menuQuery.isLoading || menuQuery.isError){
        return <QueryEvent query={menuQuery} />
    }

    function onSubmit(menu: menuCreateType) {
        mutation.mutate({id: id, ...menu});
        router.replace('..');
    }
    
    return (
        <View className="gap-6">
        <Card className="border-border/0 sm:border-border pb-4 shadow-none sm:shadow-sm sm:shadow-black/5">
            <CardHeader>
                <CardTitle className="text-center text-xl sm:text-left">Update Menu</CardTitle>
            </CardHeader>
            <Form form={form} />
            <SubmitButtons onSubmit={onSubmit} submitText='Update' form={form} />
        </Card>
        </View>
    );
}