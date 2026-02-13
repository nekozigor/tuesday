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
import Market from "@/models_mock/Market";
import { cssInterop } from "nativewind";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { useErrorDialog } from "@/providers/ErrorDialogProvider";
import { marketType } from "@/schemes/market";
import Mock from "@/models_mock/Mock";
import QueryEvent from "@/components/my/QueryEvents";

let deletedMarkets: null|marketType = null;
export default function Index(){

    const markets = Mock.create(Market);
    const { setErrorMessage } = useErrorDialog();

    const marketsQuery = useQuery<marketType[]>({
        queryKey: ['markets'],
        queryFn: () => {
            return markets.read();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const queryClient = useQueryClient();

    const mutaion = useMutation({
        mutationFn: async(market: marketType) => {
            queryClient.setQueryData(['markets'], (old: marketType[]) => 
                old?.filter((m: marketType) => m.id !== market.id)
            );
            await markets.delete(market);
        },
        onError: (error, variables, onMutateResult, context) => {
            queryClient.setQueryData(['markets'], (old: marketType[]) => {
                return old
            });
            queryClient.invalidateQueries({ queryKey: ['markets'] });
            setErrorMessage('Error deleting market: ' + variables.title);            
        },
    });
    
    const [isOpen, setIsOpen] = useState(false);

    if (marketsQuery.isLoading || marketsQuery.isError){
        return <QueryEvent query={marketsQuery} />
    }

    const TableHeader = () => (
        <View style={styles.row}>
            <View style={{flex: 1}}><Text style={styles.header}>Name</Text></View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => {router.push('/market/add')}}>
                    <AntDesign name="plus-circle" style={{justifyContent: 'center'}} size={36} className="text-[--button]"/>
                </TouchableOpacity>
            </View>
        </View>
    )

    const deleteMarketsDialog = (market: marketType) => {
        deletedMarkets = market;
        setIsOpen(true);
    }

    const deleteMarkets = () => {
        mutaion.mutate(deletedMarkets!);
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
                    <DialogTitle>Delete Markets!</DialogTitle>
                </DialogHeader>
                <Text>Are you sure you want to delete this market?</Text>
                <Button onPress={() => deleteMarkets()}>
                    <Text>Yes</Text>
                </Button>
                <Button onPress={() => setIsOpen(false)}>
                    <Text>No</Text>
                </Button>
            </DialogContent>
        </Dialog>
        <View style={{flex: 1, padding: 16}}>
            <FlatList
                ListEmptyComponent={<Text>No markets found.</Text>}
                ListHeaderComponent={<TableHeader />}
                data={marketsQuery.data}
                keyExtractor={market => market.id}
                renderItem={({item, index}) => (
                    <View style={styles.row} className={index % 2 === 0 ? "bg-[--table-odd]" : "bg-[--table-even]"} >
                        <View style={{flex: 1}}><Text>{item.title}</Text></View>
                        <View style={styles.actions}>
                            <EvilIcons name="eye" size={24} className="color-[--button]"/>
                            <TouchableOpacity onPress={() => router.push({
                                pathname:'/market/[id]', 
                                params: { id: item.id }
                            })}>
                                <FontAwesome6 name="edit" size={24} className="color-[--button]"/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteMarketsDialog(item)}>
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