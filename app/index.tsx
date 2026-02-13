import { View, ViewStyle } from "react-native";
import { Text } from '@/components/ui/text';
import { StyleSheet, TouchableOpacity } from "react-native";
import Header from "@/components/my/header";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useHelp } from "@/providers/HelpProvider";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { router, Href } from "expo-router";

export default function Index() {

    const width = 110;
    const height = 50;
    const ropeThickness = 5;
    const marginLeft = width/10;
    const marginTop =  height;
    const borderLength = 1;

    return (
        <View>
            <Header title=""/>
            <Element 
                style={{width: width, height: height, left: marginLeft, top: marginTop}} 
                text="Menus"
                link="/menu"
                clue="Menu it is what customer will see, when you add it two a market. One menu can be added to a lot of markets."
            />
            <Rope style={{
                left: marginLeft + (width/2), 
                top: marginTop + height, 
                width: ropeThickness, 
                height: height * 3 - height / 2
            }} />
            <Rope style={{
                left: marginLeft + width/2, 
                top: marginTop + height + (height * 3 - height / 2), 
                width: width / 2, 
                height: ropeThickness
            }}/>
            <Element 
                style={{width: width, height: height, left: width, top: marginTop + height * 3}} 
                text="Categories"
                link="/category"
                clue="Categories are used to group products together. You can add a product to a category and then add the category to a menu."
            />
            <Rope style={{
                left: width * 1.5, 
                top: marginTop + height * 4 + borderLength, 
                width: ropeThickness, 
                height: height + borderLength
            }} /> 
            <Element 
                style={{width: width, height: height, left: width, top: marginTop + height * 5}} 
                text="Products"
                link="/product"
                clue="Products are the items that customers can order. You can add a product to a category and then add the category to a menu."
            />
            <Rope style={{
                left: width * 1.5, 
                top: marginTop + height * 6 + borderLength, 
                width: ropeThickness, 
                height: height + borderLength
            }} /> 
            <Element 
                style={{width: width, height: height, left: width, top: marginTop + height * 7}} 
                text="Additionals"
                clue="Additionals are extra items that customers can add to their order. You can add an additional to a product and then add the product to a menu."
            />

            <Element 
                style={{width: width, height: height, left: marginLeft + width * 2.5, top: marginTop}} 
                text="Markets"
                link='/market'
                clue="Markets are the places where you sell your products. You can add a menu to a market and then customers can order from that market."    
            />
            <Rope style={{
                left: marginLeft + (width), 
                top: marginTop + height/2, 
                width: width * 2.5 - width, 
                height: ropeThickness
            }} />
            <Element 
                style={{width: width, height: height, left: marginLeft + width * 2.5, top: marginTop + height * 2}} 
                text="Promotions"
                clue="Promotions are special offers that you can add to a menu. Customers can see these promotions when they order from a market."
            />
            <Rope style={{
                left: marginLeft + width * 2.5 + (width/2), 
                top: marginTop + height + borderLength, 
                width: ropeThickness, 
                height: height
            }} />
        </View>
    );
}

const Rope = ({style} : {style: ViewStyle}) => {
    const ropeCl = 'border-1 border-solid border-blue-800 bg-blue-300';
    return (
        <View style={[style, styles.rope]} className={ropeCl}></View>
    )
}

const Element = ({style, text, link, clue} : {style: ViewStyle, text: string, link?: Href, clue?: string}) => {
    const { isHelpCalled } = useHelp();
    const cl = 'border-2 border-solid rounded-lg border-gray-200 justify-center items-center bg-white shadow-md';

    return (
        <View className={cl} style={[style, styles.element]}>
                <TouchableOpacity onPress={() => link && router.push(link)}>
                    <Text className="text-[--primary]">{text}</Text>
                </TouchableOpacity>
                {clue && 
                <Tooltip style={{position: 'absolute', top: 2, right: 2, display: isHelpCalled ? 'flex' : 'none'}}>
                    <TooltipTrigger asChild>
                        <TouchableOpacity>
                            <FontAwesome5 name="question-circle" size={16} className="color-[--question-blue]" />
                        </TouchableOpacity>
                </TooltipTrigger>
                    <TooltipContent>
                        <Text>{clue}</Text>
                    </TooltipContent>
                </Tooltip>
                }
        </View>
    );
}

const styles = StyleSheet.create({
    element: {
        position: 'absolute',
    },
    rope: {
        position: 'absolute',
    }
});