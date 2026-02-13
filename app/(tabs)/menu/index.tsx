import { Text } from "@/components/ui/text";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { FlatList, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Menus from "@/models_mock/Menus";
import { cssInterop } from "nativewind";
import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useErrorDialog } from "@/providers/ErrorDialogProvider";
import { menuType } from "@/schemes/menu";
import Mock from "@/models_mock/Mock";
import QueryEvent from "@/components/my/QueryEvents";

let deletedMenu: null|menuType = null;
export default function Index(){

    const menus = Mock.create(Menus);

    const { setErrorMessage } = useErrorDialog();

    const menusQuery = useQuery<menuType[]>({
        queryKey: ['menus'],
        queryFn: async () => {
            console.log('fetch')
            return await menus.read();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const queryClient = useQueryClient();

    const mutaion = useMutation({
        mutationFn: async(menu: menuType) => {
            queryClient.setQueryData(['menus'], (old: menuType[]) => 
                old?.filter((m: menuType) => m.id !== menu.id)
            );
            await menus.delete(menu);
        },
        onError: (error, variables, onMutateResult, context) => {
            queryClient.setQueryData(['menus'], (old: menuType[]) => {
                return old
            });
            queryClient.invalidateQueries({ queryKey: ['menus'] });
            setErrorMessage('Error deleting menu: ' + variables.title);            
        },
    });
    
    const [isOpen, setIsOpen] = useState(false);

    if (menusQuery.isLoading || menusQuery.isError){
        return <QueryEvent query={menusQuery} />
    }

    const TableHeader = () => (
        <View style={styles.row}>
            <View style={{flex: 1}}><Text style={styles.header}>Name</Text></View>
            <View style={{flex: 1}}><Text style={styles.header}>Status</Text></View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => {router.push('/menu/add')}}>
                    <AntDesign name="plus-circle" style={{justifyContent: 'center'}} size={36} className="text-[--button]"/>
                </TouchableOpacity>
            </View>
        </View>
    )

    const deleteMenuDialog = (menu: menuType) => {
        deletedMenu = menu;
        setIsOpen(true);
    }

    const deleteMenu = () => {
        mutaion.mutate(deletedMenu!);
        setIsOpen(false);
    }

    const imgList = [EvilIcons, FontAwesome6, MaterialIcons].map(MaterialIcons =>
        cssInterop(MaterialIcons, {
            className: {
                target: "style",
                nativeStyleToProp: { color: "color" },
            },
        })  
    );

    return (<>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Menu!</DialogTitle>
                </DialogHeader>
                <Text>Are you sure you want to delete this menu?</Text>
                <Button onPress={() => deleteMenu()}>
                    <Text>Yes</Text>
                </Button>
                <Button onPress={() => setIsOpen(false)}>
                    <Text>No</Text>
                </Button>
            </DialogContent>
        </Dialog>
        <View style={{flex: 1, padding: 16}}>
            <FlatList
                ListHeaderComponent={<TableHeader />}
                ListEmptyComponent={<Text>No menus found.</Text>}
                data={menusQuery.data}
                keyExtractor={menu => menu.id}
                renderItem={({item, index}) => (
                    <View style={styles.row} className={index % 2 === 0 ? "bg-[--table-odd]" : "bg-[--table-even]"} >
                        <View style={{flex: 1}}><Text>{item.title}</Text></View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={{flex: -1}}
                                className={"rounded-md p-1 shadow-2xl " 
                                + (item.status === 'active' 
                                ? "bg-[--table-active] text-[--button] " :
                                 "bg-[--table-inactive]  text-[--button]"
                            )}>
                                
                                {item.status}</Text>
                        </View>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => router.push({
                                pathname:'/menu/[id]/view', 
                                params: { id: item.id }
                            })}>
                                <EvilIcons name="eye" size={24} className="color-[--button]"/>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={() => router.push({
                                pathname:'/menu/[id]/products', 
                                params: { id: item.id }
                            })}>
                                <AntDesign name="product" size={24} color="color-[--button]" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push({
                                pathname:'/menu/[id]/update', 
                                params: { id: item.id }
                            })}>
                                <FontAwesome6 name="edit" size={24} className="color-[--button]"/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteMenuDialog(item)}>
                                <MaterialIcons name="delete-forever" size={24} className="color-[--button]"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    </>)
}


const styles = StyleSheet.create({
    header: {
        fontSize: 16, 
        fontWeight: 'bold', 
        // marginBottom: 16,
    },
    row: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 16, 
        borderBottomWidth: 1, 
        borderColor: '#ccc',
        flexGrow: 1
    },
    actions:{
        flexDirection: 'row', 
        gap: 16, 
        width: 110, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})