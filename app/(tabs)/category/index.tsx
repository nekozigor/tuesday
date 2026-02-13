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
import Categories from "@/models_mock/Categories";
import { cssInterop } from "nativewind";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useErrorDialog } from "@/providers/ErrorDialogProvider";
import { categoryType } from "@/schemes/category";
import Mock from "@/models_mock/Mock";
import QueryEvent from "@/components/my/QueryEvents";

let deletedCategories: null|categoryType = null;
export default function Index(){

    const categories = Mock.create(Categories);
    const { setErrorMessage } = useErrorDialog();

    const categoriesQuery = useQuery<categoryType[]>({
        queryKey: ['categories'],
        queryFn: () => {
            return categories.read();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const queryClient = useQueryClient();

    const mutaion = useMutation({
        mutationFn: async(category: categoryType) => {
            queryClient.setQueryData(['categories'], (old: categoryType[]) => 
                old?.filter((m: categoryType) => m.id !== category.id)
            );
            await categories.delete(category);
        },
        onError: (error, variables, onMutateResult, context) => {
            queryClient.setQueryData(['categories'], (old: categoryType[]) => {
                return old
            });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setErrorMessage('Error deleting category: ' + variables.title);            
        },
    });
    
    const [isOpen, setIsOpen] = useState(false);

    if (categoriesQuery.isLoading || categoriesQuery.isError){
        return <QueryEvent query={categoriesQuery} />
    }

    const TableHeader = () => (
        <View style={styles.row}>
            <View style={{flex: 1}}><Text style={styles.header}>Name</Text></View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => {router.push('/category/add')}}>
                    <AntDesign name="plus-circle" style={{justifyContent: 'center'}} size={36} className="text-[--button]"/>
                </TouchableOpacity>
            </View>
        </View>
    )

    const deleteCategoriesDialog = (category: categoryType) => {
        deletedCategories = category;
        setIsOpen(true);
    }

    const deleteCategories = () => {
        mutaion.mutate(deletedCategories!);
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
                    <DialogTitle>Delete Categories!</DialogTitle>
                </DialogHeader>
                <Text>Are you sure you want to delete this category?</Text>
                <Button onPress={() => deleteCategories()}>
                    <Text>Yes</Text>
                </Button>
                <Button onPress={() => setIsOpen(false)}>
                    <Text>No</Text>
                </Button>
            </DialogContent>
        </Dialog>
        <View style={{flex: 1, padding: 16}}>
            <FlatList
                ListEmptyComponent={<Text>No categories found.</Text>}
                ListHeaderComponent={<TableHeader />}
                data={categoriesQuery.data}
                keyExtractor={category => category.id}
                renderItem={({item, index}) => (
                    <View style={styles.row} className={index % 2 === 0 ? "bg-[--table-odd]" : "bg-[--table-even]"} >
                        <View style={{flex: 1}}><Text>{item.title}</Text></View>
                        <View style={styles.actions}>
                            <EvilIcons name="eye" size={24} className="color-[--button]"/>
                            <TouchableOpacity onPress={() => router.push({
                                pathname:'/category/[id]', 
                                params: { id: item.id }
                            })}>
                                <FontAwesome6 name="edit" size={24} className="color-[--button]"/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteCategoriesDialog(item)}>
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