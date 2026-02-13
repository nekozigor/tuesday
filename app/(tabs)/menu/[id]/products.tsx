import { StyleSheet, SectionList, SectionListData, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import Mock from "@/models_mock/Mock";
import { useQuery } from "@tanstack/react-query";
import QueryEvent from "@/components/my/QueryEvents";
import { MenuSelectList, productListType } from "@/data_transform/MenuSelectList";
import { useCallback, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import SubmitButtons from "@/components/my/form/SubmitButtons";
import MenuProducts from "@/models_mock/MenuProducts";
import { menuProductsSchema, menuProductsType, menuProductType } from "@/schemes/menuProducts";
import { zodResolver } from "@hookform/resolvers/zod";

const CELL_HEIGHT = 51;
const HEADER_HEIGHT = 71;

export default function Products(){
    const router = useRouter();
    const sectionListRef = useRef<SectionList<menuProductType, productListType>>(null);
    const menuProducts = Mock.create(MenuProducts);
    const { id } = useLocalSearchParams<{ id: string }>();

    const productQuery = useQuery<menuProductsType>({
        queryKey: ['products_' + id],
        queryFn: async () => await menuProducts.readOne(id),
        gcTime: 0,
    });

    const form = useForm({
        resolver: zodResolver(menuProductsSchema),
        values: productQuery.data
    });

    const renderSectionHeader = useCallback(({ section }: { section: SectionListData<string, any> }) => (
        <View style={styles.header}>
            <Text style={styles.headerText}>{section.title}</Text>
        </View>
    ), []);

    if (productQuery.isLoading || productQuery.isError){
        return <QueryEvent query={productQuery} />
    }

    const onSubmit = (updateProducts: menuProductsType) => {
        const products = productQuery.data?.products;
        if (products && updateProducts){
            const arr: menuProductsType['products'] = [];
            form.formState.dirtyFields.products?.forEach((product, index) => {
                arr.push({...products[index], ...updateProducts.products[index]});
            });
            menuProducts.updateProducts(id, arr);
        }

        router.replace('/menu');
    }
 
    const bodySelectList = MenuSelectList.convertProductsToList(productQuery.data);
    const headerIndex = MenuSelectList.getHeaderIndex(bodySelectList);

    return (
        <View style={{ flex: 1 }}>
            <SubmitButtons form={form} submitText="Save" onSubmit={onSubmit} />
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
                renderSectionHeader={renderSectionHeader}
                // renderSectionHeader={({ section: { title } }) => (
                //     <View style={styles.header}>
                //         <Text style={styles.headerText}>{title}</Text>
                //     </View>
                // )}
                renderItem={({ item, index }) => (
                    <View style={styles.item}>
                        <Controller
                            control={form.control}
                            name={`products.${item.fieldIndex}.added`}
                            render={({ field: {onChange, value}}) => (
                                <Checkbox style={styles.itemText} checked={value ?? false} onCheckedChange={onChange} />
                            )}
                        />
                        <Text style={styles.itemText}>{item.title}</Text>
                        <Controller
                            control={form.control}
                            name={`products.${item.fieldIndex}.price`}
                            render={({ field: {onChange, value}, fieldState: {error}},) => (
                                <Input 
                                    style={{...styles.itemText, width: 200}} 
                                    className={error ? 'border-red-500': ''} 
                                    value={value?.toString()} onChange={onChange} 
                                />
                            )}
                        />
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
        flexDirection: 'row',
        paddingLeft: 20, 
        borderBottomWidth: 1, 
        borderColor: '#eee', 
        height: 50,
        justifyContent: 'space-between',
        paddingRight: '10%'
    },
    itemText: {
        marginTop: 'auto',
        marginBottom: 'auto',
    }
});