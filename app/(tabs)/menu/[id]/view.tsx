import { Text } from "@/components/ui/text";
import QueryEvent from "@/components/my/QueryEvents";
import Mock from "@/models_mock/Mock";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { MenuSelectList, productListType } from "@/data_transform/MenuSelectList";
import React, { useRef, useState } from 'react';
import { View,  FlatList, SectionList, TouchableOpacity, StyleSheet, SectionListData, ViewToken } from 'react-native';
import MenuProducts from "@/models_mock/MenuProducts";
import { menuProductsType, menuProductType } from "@/schemes/menuProducts";


const CELL_HEIGHT = 51;
const HEADER_HEIGHT = 71;

export default function MenuScreen() {
    const sectionListRef = useRef<SectionList<menuProductType, productListType>>(null);
    const [activeTab, setActiveTab] = useState(0);
    const tabListRef = useRef<FlatList<any>>(null);
    const { id } = useLocalSearchParams<{ id: string }>();
    const menu = Mock.create(MenuProducts);
    const tabWasClicked = useRef<boolean>(false)
    const menuQuery = useQuery<menuProductsType>({
        queryKey: ['menu_' + id],
        queryFn: async () => {
            return await menu.getAddedProducts(id);
        },
        // select: ( data ) => MenuSelectList.convertProductsToList(data.products),
        // staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 0,
        retry: false,
    });

    const onPressTab = (index: number) => {
        tabWasClicked.current = true;
        setTimeout(() => tabWasClicked.current = false, 500);
        sectionListRef.current?.scrollToLocation({
            sectionIndex: index,
            itemIndex: 0,
            viewPosition: 0,
            animated: true,
            
        });
        setActiveTab(index);
    };

    if (menuQuery.isLoading || menuQuery.isError){
        return <QueryEvent query={menuQuery} />
    }

    if (menuQuery.data == undefined){
        return <Text>Not found!</Text>
    }

    const onViewableItemsChanged = ({ viewableItems }: {viewableItems: Array<ViewToken<menuProductType>>}) => {
        if(!tabWasClicked.current && viewableItems.length > 0 && viewableItems[0].section.index != activeTab){
            setActiveTab(viewableItems[0].section.index);
            tabListRef.current?.scrollToIndex({
                animated: true,
                // viewPosition: viewableItems[0].section.index,
                viewOffset: 0,
                index: viewableItems[0].section.index,
            });
        }
    }

    const bodySelectList = MenuSelectList.convertProductsToList(menuQuery.data);
    const headerIndex = MenuSelectList.getHeaderIndex(bodySelectList);

    return (
        <View style={{ flex: 1 }}>
            <View>
                <FlatList
                    horizontal
                    data={bodySelectList}
                    showsHorizontalScrollIndicator={false}
                    ref={tabListRef}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity 
                            onPress={() => onPressTab(index)}
                            style={[styles.tab, activeTab === index && styles.activeTab]}
                        >
                            <Text style={activeTab === index ? styles.activeText : ''}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <SectionList<menuProductType, productListType>
                style={{flex: 1}}
                ref={sectionListRef}
                sections={bodySelectList as ReadonlyArray<SectionListData<string, any>>}
                keyExtractor={(item, index) => item.id}
                stickySectionHeadersEnabled={true}
                initialNumToRender={50}
                contentContainerStyle={{ paddingBottom: 900 }} 
                viewabilityConfig={
                    {
                        itemVisiblePercentThreshold: 100
                    }
                }
                getItemLayout={(data, index) => {
                    return {
                        length: CELL_HEIGHT,
                        offset: CELL_HEIGHT * index - headerIndex(index) * HEADER_HEIGHT,
                        index: index,
                    }
                }}
                onViewableItemsChanged={onViewableItemsChanged}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{title}</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.title}</Text>
                        <Text style={styles.itemText}>${item.price}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    tab: {
        padding: 15, 
        marginHorizontal: 5, 
        borderBottomWidth: 2, 
        borderColor: 'transparent' 
    },
    activeTab: { borderColor: 'orange' },
    activeText: { color: 'orange', fontWeight: 'bold' },
    header: { 
        backgroundColor: '#f8f8f8', 
        paddingLeft: 10,
        height: 40,
    },
    headerText: { fontSize: 18, fontWeight: 'bold' },
    item: { 
        paddingLeft: 20, 
        borderBottomWidth: 1, 
        borderColor: '#eee', 
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: '10%',
        alignContent: 'center',
    },
    itemText: {
        marginTop: 'auto',
        marginBottom: 'auto',
    }
});