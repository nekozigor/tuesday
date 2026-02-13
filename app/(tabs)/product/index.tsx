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
import { cssInterop } from "nativewind";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useErrorDialog } from "@/providers/ErrorDialogProvider";
import { productType } from "@/schemes/product";
import Mock from "@/models_mock/Mock";
import QueryEvent from "@/components/my/QueryEvents";
import Products from "@/models_mock/Products";

let deletedProducts: null|productType = null;
export default function Index(){

    const products = Mock.create(Products);
    const { setErrorMessage } = useErrorDialog();

    const productsQuery = useQuery<productType[]>({
        queryKey: ['products'],
        queryFn: () => {
            return products.read();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const queryClient = useQueryClient();

    const mutaion = useMutation({
        mutationFn: async(product: productType) => {
            queryClient.setQueryData(['products'], (old: productType[]) => 
                old?.filter((m: productType) => m.id !== product.id)
            );
            await products.delete(product);
        },
        onError: (error, variables, onMutateResult, context) => {
            queryClient.setQueryData(['products'], (old: productType[]) => {
                return old
            });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setErrorMessage('Error deleting product: ' + variables.title);            
        },
    });
    
    const [isOpen, setIsOpen] = useState(false);

    if (productsQuery.isLoading || productsQuery.isError){
        return <QueryEvent query={productsQuery} />
    }

    const TableHeader = () => (
        <View style={styles.row}>
            <View style={{flex: 1}}><Text style={styles.header}>Name</Text></View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => {router.push('/product/add')}}>
                    <AntDesign name="plus-circle" style={{justifyContent: 'center'}} size={36} className="text-[--button]"/>
                </TouchableOpacity>
            </View>
        </View>
    )

    const deleteCategoriesDialog = (product: productType) => {
        deletedProducts = product;
        setIsOpen(true);
    }

    const deleteCategories = () => {
        mutaion.mutate(deletedProducts!);
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
                <Text>Are you sure you want to delete this product?</Text>
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
                ListEmptyComponent={<Text>No products found.</Text>}
                ListHeaderComponent={<TableHeader />}
                data={productsQuery.data}
                keyExtractor={product => product.id}
                renderItem={({item, index}) => (
                    <View style={styles.row} className={index % 2 === 0 ? "bg-[--table-odd]" : "bg-[--table-even]"} >
                        <View style={{flex: 1}}><Text>{item.title}</Text></View>
                        <View style={styles.actions}>
                            <EvilIcons name="eye" size={24} className="color-[--button]"/>
                            <TouchableOpacity onPress={() => router.push({
                                pathname:'/product/[id]', 
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